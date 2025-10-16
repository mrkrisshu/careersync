import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { Plus, Search, Filter, Edit3, Trash2, Calendar, MapPin, Building, DollarSign, Clock, CheckCircle, XCircle, AlertCircle, Eye, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

interface JobApplication {
  id: string
  jobTitle: string
  companyName: string
  location: string
  salary: string
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship'
  status: 'applied' | 'interview' | 'offer' | 'rejected' | 'withdrawn'
  appliedDate: string
  notes: string
  jobUrl: string
  contactPerson: string
  contactEmail: string
  interviewDate?: string
  followUpDate?: string
}

const JobTracker = () => {
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [filteredApplications, setFilteredApplications] = useState<JobApplication[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState<Partial<JobApplication>>({
    jobTitle: '',
    companyName: '',
    location: '',
    salary: '',
    jobType: 'full-time',
    status: 'applied',
    appliedDate: new Date().toISOString().split('T')[0],
    notes: '',
    jobUrl: '',
    contactPerson: '',
    contactEmail: '',
    interviewDate: '',
    followUpDate: ''
  })

  const statusOptions = [
    { value: 'applied', label: 'Applied', color: 'bg-blue-500', icon: Clock },
    { value: 'interview', label: 'Interview', color: 'bg-yellow-500', icon: Calendar },
    { value: 'offer', label: 'Offer', color: 'bg-green-500', icon: CheckCircle },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-500', icon: XCircle },
    { value: 'withdrawn', label: 'Withdrawn', color: 'bg-gray-500', icon: AlertCircle }
  ]

  const jobTypeOptions = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' }
  ]

  // Load applications on component mount
  useEffect(() => {
    loadApplications()
  }, [])

  // Filter applications based on search and status
  useEffect(() => {
    let filtered = applications

    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter)
    }

    setFilteredApplications(filtered)
  }, [applications, searchTerm, statusFilter])

  const loadApplications = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/jobs')
      if (response.ok) {
        const data = await response.json()
        setApplications(data.applications || [])
      }
    } catch (error) {
      console.error('Error loading applications:', error)
      // Load mock data for demo
      setApplications([
        {
          id: '1',
          jobTitle: 'Senior Software Engineer',
          companyName: 'Google',
          location: 'Mountain View, CA',
          salary: '$150,000 - $200,000',
          jobType: 'full-time',
          status: 'interview',
          appliedDate: '2024-01-15',
          notes: 'Great company culture, exciting projects',
          jobUrl: 'https://careers.google.com/jobs/123',
          contactPerson: 'John Smith',
          contactEmail: 'john.smith@google.com',
          interviewDate: '2024-01-25'
        },
        {
          id: '2',
          jobTitle: 'Frontend Developer',
          companyName: 'Microsoft',
          location: 'Seattle, WA',
          salary: '$120,000 - $160,000',
          jobType: 'full-time',
          status: 'applied',
          appliedDate: '2024-01-20',
          notes: 'Applied through LinkedIn',
          jobUrl: 'https://careers.microsoft.com/jobs/456',
          contactPerson: '',
          contactEmail: ''
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.jobTitle || !formData.companyName) {
      toast.error('Please fill in required fields')
      return
    }

    setIsLoading(true)

    try {
      const applicationData = {
        ...formData,
        id: selectedApplication?.id || Date.now().toString()
      }

      if (selectedApplication) {
        // Update existing application
        const response = await fetch(`/api/jobs/${selectedApplication.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(applicationData)
        })

        if (response.ok) {
          setApplications(prev => 
            prev.map(app => app.id === selectedApplication.id ? applicationData as JobApplication : app)
          )
          toast.success('Application updated successfully!')
        }
      } else {
        // Add new application
        const response = await fetch('/api/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(applicationData)
        })

        if (response.ok) {
          setApplications(prev => [...prev, applicationData as JobApplication])
          toast.success('Application added successfully!')
        }
      }

      resetForm()
    } catch (error) {
      console.error('Error saving application:', error)
      // For demo, still add to local state
      if (selectedApplication) {
        setApplications(prev => 
          prev.map(app => app.id === selectedApplication.id ? formData as JobApplication : app)
        )
        toast.success('Application updated successfully!')
      } else {
        const newApp = { ...formData, id: Date.now().toString() } as JobApplication
        setApplications(prev => [...prev, newApp])
        toast.success('Application added successfully!')
      }
      resetForm()
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (application: JobApplication) => {
    setSelectedApplication(application)
    setFormData(application)
    setShowEditModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return

    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setApplications(prev => prev.filter(app => app.id !== id))
        toast.success('Application deleted successfully!')
      }
    } catch (error) {
      console.error('Error deleting application:', error)
      // For demo, still remove from local state
      setApplications(prev => prev.filter(app => app.id !== id))
      toast.success('Application deleted successfully!')
    }
  }

  const resetForm = () => {
    setFormData({
      jobTitle: '',
      companyName: '',
      location: '',
      salary: '',
      jobType: 'full-time',
      status: 'applied',
      appliedDate: new Date().toISOString().split('T')[0],
      notes: '',
      jobUrl: '',
      contactPerson: '',
      contactEmail: '',
      interviewDate: '',
      followUpDate: ''
    })
    setSelectedApplication(null)
    setShowAddModal(false)
    setShowEditModal(false)
  }

  const getStatusIcon = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status)
    if (!statusOption) return Clock
    return statusOption.icon
  }

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status)
    return statusOption?.color || 'bg-gray-500'
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusStats = () => {
    const stats = statusOptions.map(option => ({
      ...option,
      count: applications.filter(app => app.status === option.value).length
    }))
    return stats
  }

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white">Job Tracker</h1>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Application
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {getStatusStats().map((stat) => {
              const IconComponent = stat.icon
              return (
                <div key={stat.value} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${stat.color}`}>
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{stat.count}</p>
                      <p className="text-slate-400 text-sm">{stat.label}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by job title, company, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Applications List */}
          <div className="space-y-4">
            {filteredApplications.length === 0 ? (
              <div className="bg-slate-800 rounded-xl p-12 border border-slate-700 text-center">
                <Building className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Applications Found</h3>
                <p className="text-slate-400 mb-6">
                  {applications.length === 0 
                    ? "Start tracking your job applications by adding your first application."
                    : "No applications match your current search or filter criteria."
                  }
                </p>
                {applications.length === 0 && (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors mx-auto"
                  >
                    <Plus className="w-4 h-4" />
                    Add Your First Application
                  </button>
                )}
              </div>
            ) : (
              filteredApplications.map((application) => {
                const StatusIcon = getStatusIcon(application.status)
                return (
                  <div key={application.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold text-white">{application.jobTitle}</h3>
                              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs text-white ${getStatusColor(application.status)}`}>
                                <StatusIcon className="w-3 h-3" />
                                {statusOptions.find(s => s.value === application.status)?.label}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 text-slate-400 mb-3">
                              <div className="flex items-center gap-1">
                                <Building className="w-4 h-4" />
                                {application.companyName}
                              </div>
                              {application.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {application.location}
                                </div>
                              )}
                              {application.salary && (
                                <div className="flex items-center gap-1">
                                  <DollarSign className="w-4 h-4" />
                                  {application.salary}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              <span>Applied: {formatDate(application.appliedDate)}</span>
                              <span className="capitalize">{application.jobType}</span>
                              {application.interviewDate && (
                                <span className="text-yellow-400">
                                  Interview: {formatDate(application.interviewDate)}
                                </span>
                              )}
                            </div>

                            {application.notes && (
                              <p className="text-slate-300 mt-3 text-sm">{application.notes}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        {application.jobUrl && (
                          <a
                            href={application.jobUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition-colors"
                            title="View Job Posting"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => handleEdit(application)}
                          className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition-colors"
                          title="Edit Application"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(application.id)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                          title="Delete Application"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Add/Edit Modal */}
          {(showAddModal || showEditModal) && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {selectedApplication ? 'Edit Application' : 'Add New Application'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Job Title *
                      </label>
                      <input
                        type="text"
                        value={formData.jobTitle || ''}
                        onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        value={formData.companyName || ''}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location || ''}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="e.g., San Francisco, CA"
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Salary Range
                      </label>
                      <input
                        type="text"
                        value={formData.salary || ''}
                        onChange={(e) => handleInputChange('salary', e.target.value)}
                        placeholder="e.g., $80,000 - $120,000"
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Job Type
                      </label>
                      <select
                        value={formData.jobType || 'full-time'}
                        onChange={(e) => handleInputChange('jobType', e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {jobTypeOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Status
                      </label>
                      <select
                        value={formData.status || 'applied'}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {statusOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Applied Date
                      </label>
                      <input
                        type="date"
                        value={formData.appliedDate || ''}
                        onChange={(e) => handleInputChange('appliedDate', e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Job URL
                    </label>
                    <input
                      type="url"
                      value={formData.jobUrl || ''}
                      onChange={(e) => handleInputChange('jobUrl', e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Contact Person
                      </label>
                      <input
                        type="text"
                        value={formData.contactPerson || ''}
                        onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                        placeholder="Recruiter or hiring manager name"
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        value={formData.contactEmail || ''}
                        onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                        placeholder="contact@company.com"
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Interview Date
                      </label>
                      <input
                        type="date"
                        value={formData.interviewDate || ''}
                        onChange={(e) => handleInputChange('interviewDate', e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Follow-up Date
                      </label>
                      <input
                        type="date"
                        value={formData.followUpDate || ''}
                        onChange={(e) => handleInputChange('followUpDate', e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes || ''}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Add any notes about this application..."
                      rows={4}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Saving...' : (selectedApplication ? 'Update Application' : 'Add Application')}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-3 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default JobTracker