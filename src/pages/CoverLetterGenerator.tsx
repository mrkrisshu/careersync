import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { FileText, Briefcase, User, Zap, Download, Copy, RefreshCw, Loader2, Settings } from 'lucide-react'
import { toast } from 'sonner'

interface CoverLetterData {
  jobTitle: string
  companyName: string
  jobDescription: string
  personalInfo: {
    name: string
    email: string
    phone: string
    address: string
  }
  tone: 'professional' | 'enthusiastic' | 'creative' | 'formal'
  experience: string
  skills: string
  achievements: string
}

const CoverLetterGenerator = () => {
  const [formData, setFormData] = useState<CoverLetterData>({
    jobTitle: '',
    companyName: '',
    jobDescription: '',
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      address: ''
    },
    tone: 'professional',
    experience: '',
    skills: '',
    achievements: ''
  })
  
  const [generatedLetter, setGeneratedLetter] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const toneOptions = [
    { value: 'professional', label: 'Professional', description: 'Formal and business-like tone' },
    { value: 'enthusiastic', label: 'Enthusiastic', description: 'Energetic and passionate tone' },
    { value: 'creative', label: 'Creative', description: 'Unique and innovative approach' },
    { value: 'formal', label: 'Formal', description: 'Traditional and conservative tone' }
  ]

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof CoverLetterData],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const generateCoverLetter = async () => {
    if (!formData.jobTitle || !formData.companyName || !formData.personalInfo.name) {
      toast.error('Please fill in the required fields (Job Title, Company Name, and Your Name)')
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch('/api/cover-letter/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to generate cover letter')
      }

      const result = await response.json()
      setGeneratedLetter(result.coverLetter)
      setShowPreview(true)
      toast.success('Cover letter generated successfully!')
    } catch (error) {
      console.error('Error generating cover letter:', error)
      toast.error('Failed to generate cover letter. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyCoverLetter = () => {
    navigator.clipboard.writeText(generatedLetter)
    toast.success('Cover letter copied to clipboard!')
  }

  const downloadCoverLetter = () => {
    const blob = new Blob([generatedLetter], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cover-letter-${formData.companyName.toLowerCase().replace(/\s+/g, '-')}.txt`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    toast.success('Cover letter downloaded!')
  }

  const regenerateLetter = () => {
    generateCoverLetter()
  }

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white">Cover Letter Generator</h1>
            {generatedLetter && (
              <div className="flex items-center gap-2">
                <button
                  onClick={regenerateLetter}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw className="w-4 h-4" />
                  Regenerate
                </button>
                <button
                  onClick={copyCoverLetter}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
                <button
                  onClick={downloadCoverLetter}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Form */}
            <div className="space-y-6">
              {/* Job Information */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                  Job Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      value={formData.jobTitle}
                      onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                      placeholder="e.g., Software Engineer"
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      placeholder="e.g., Google"
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Job Description
                    </label>
                    <textarea
                      value={formData.jobDescription}
                      onChange={(e) => handleInputChange('jobDescription', e.target.value)}
                      placeholder="Paste the job description here for better customization..."
                      rows={4}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-green-400" />
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.personalInfo.name}
                      onChange={(e) => handleInputChange('personalInfo.name', e.target.value)}
                      placeholder="Your full name"
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.personalInfo.email}
                      onChange={(e) => handleInputChange('personalInfo.email', e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.personalInfo.phone}
                      onChange={(e) => handleInputChange('personalInfo.phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={formData.personalInfo.address}
                      onChange={(e) => handleInputChange('personalInfo.address', e.target.value)}
                      placeholder="City, State"
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Tone Selection */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-purple-400" />
                  Writing Tone
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {toneOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        formData.tone === option.value
                          ? 'border-blue-500 bg-blue-900/20'
                          : 'border-slate-600 hover:border-slate-500'
                      }`}
                    >
                      <input
                        type="radio"
                        name="tone"
                        value={option.value}
                        checked={formData.tone === option.value}
                        onChange={(e) => handleInputChange('tone', e.target.value)}
                        className="sr-only"
                      />
                      <div>
                        <div className="text-white font-medium">{option.label}</div>
                        <div className="text-slate-400 text-sm">{option.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Additional Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Relevant Experience
                    </label>
                    <textarea
                      value={formData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      placeholder="Briefly describe your relevant work experience..."
                      rows={3}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Key Skills
                    </label>
                    <textarea
                      value={formData.skills}
                      onChange={(e) => handleInputChange('skills', e.target.value)}
                      placeholder="List your key skills relevant to this position..."
                      rows={3}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Notable Achievements
                    </label>
                    <textarea
                      value={formData.achievements}
                      onChange={(e) => handleInputChange('achievements', e.target.value)}
                      placeholder="Highlight your key achievements and accomplishments..."
                      rows={3}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateCoverLetter}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Cover Letter...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    Generate Cover Letter
                  </>
                )}
              </button>
            </div>

            {/* Preview Panel */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Cover Letter Preview
              </h2>
              
              {generatedLetter ? (
                <div className="bg-white rounded-lg p-8 text-slate-900 min-h-[600px] shadow-lg">
                  <div className="whitespace-pre-wrap font-serif leading-relaxed">
                    {generatedLetter}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-700 rounded-lg p-8 text-center min-h-[600px] flex items-center justify-center">
                  <div>
                    <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">No Cover Letter Generated</h3>
                    <p className="text-slate-400">
                      Fill in the form and click "Generate Cover Letter" to see your personalized cover letter here.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoverLetterGenerator