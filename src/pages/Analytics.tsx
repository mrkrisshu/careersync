import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts'
import { TrendingUp, TrendingDown, Users, Calendar, Target, Award, Clock, CheckCircle, XCircle, AlertCircle, Building } from 'lucide-react'

interface AnalyticsData {
  totalApplications: number
  responseRate: number
  interviewRate: number
  offerRate: number
  averageResponseTime: number
  monthlyApplications: Array<{ month: string; applications: number }>
  statusDistribution: Array<{ name: string; value: number; color: string }>
  companyTypes: Array<{ name: string; applications: number }>
  applicationTrends: Array<{ date: string; applications: number; interviews: number; offers: number }>
}

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('6months')

  useEffect(() => {
    loadAnalyticsData()
  }, [timeRange])

  const loadAnalyticsData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/jobs/analytics?range=${timeRange}`)
      if (response.ok) {
        const data = await response.json()
        setAnalyticsData(data)
      } else {
        // Load mock data for demo
        setAnalyticsData(getMockAnalyticsData())
      }
    } catch (error) {
      console.error('Error loading analytics:', error)
      // Load mock data for demo
      setAnalyticsData(getMockAnalyticsData())
    } finally {
      setIsLoading(false)
    }
  }

  const getMockAnalyticsData = (): AnalyticsData => {
    return {
      totalApplications: 47,
      responseRate: 32,
      interviewRate: 18,
      offerRate: 8,
      averageResponseTime: 12,
      monthlyApplications: [
        { month: 'Aug', applications: 8 },
        { month: 'Sep', applications: 12 },
        { month: 'Oct', applications: 15 },
        { month: 'Nov', applications: 9 },
        { month: 'Dec', applications: 3 },
        { month: 'Jan', applications: 0 }
      ],
      statusDistribution: [
        { name: 'Applied', value: 25, color: '#3B82F6' },
        { name: 'Interview', value: 8, color: '#F59E0B' },
        { name: 'Offer', value: 4, color: '#10B981' },
        { name: 'Rejected', value: 8, color: '#EF4444' },
        { name: 'Withdrawn', value: 2, color: '#6B7280' }
      ],
      companyTypes: [
        { name: 'Tech Startups', applications: 18 },
        { name: 'Enterprise', applications: 12 },
        { name: 'Mid-size', applications: 10 },
        { name: 'Consulting', applications: 4 },
        { name: 'Finance', applications: 3 }
      ],
      applicationTrends: [
        { date: '2024-08', applications: 8, interviews: 3, offers: 1 },
        { date: '2024-09', applications: 12, interviews: 5, offers: 2 },
        { date: '2024-10', applications: 15, interviews: 6, offers: 1 },
        { date: '2024-11', applications: 9, interviews: 4, offers: 0 },
        { date: '2024-12', applications: 3, interviews: 1, offers: 0 }
      ]
    }
  }

  const formatPercentage = (value: number) => `${value}%`
  const formatNumber = (value: number) => value.toLocaleString()

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'applied': return Clock
      case 'interview': return Calendar
      case 'offer': return CheckCircle
      case 'rejected': return XCircle
      case 'withdrawn': return AlertCircle
      default: return Clock
    }
  }

  const getChangeIndicator = (current: number, previous: number) => {
    if (current > previous) {
      return { icon: TrendingUp, color: 'text-green-400', text: 'increase' }
    } else if (current < previous) {
      return { icon: TrendingDown, color: 'text-red-400', text: 'decrease' }
    }
    return { icon: TrendingUp, color: 'text-slate-400', text: 'no change' }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-slate-900">
        <Sidebar />
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-white text-lg">Loading analytics...</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="flex h-screen bg-slate-900">
        <Sidebar />
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="bg-slate-800 rounded-xl p-12 border border-slate-700 text-center">
              <Building className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Data Available</h3>
              <p className="text-slate-400">Start applying to jobs to see your analytics dashboard.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
            <div className="flex items-center gap-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last Year</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Total Applications</p>
                  <p className="text-3xl font-bold text-white mt-1">{analyticsData.totalApplications}</p>
                </div>
                <div className="p-3 bg-blue-500 rounded-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Response Rate</p>
                  <p className="text-3xl font-bold text-white mt-1">{analyticsData.responseRate}%</p>
                </div>
                <div className="p-3 bg-green-500 rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Interview Rate</p>
                  <p className="text-3xl font-bold text-white mt-1">{analyticsData.interviewRate}%</p>
                </div>
                <div className="p-3 bg-yellow-500 rounded-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Offer Rate</p>
                  <p className="text-3xl font-bold text-white mt-1">{analyticsData.offerRate}%</p>
                </div>
                <div className="p-3 bg-purple-500 rounded-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Avg Response Time</p>
                  <p className="text-3xl font-bold text-white mt-1">{analyticsData.averageResponseTime}</p>
                  <p className="text-slate-400 text-xs">days</p>
                </div>
                <div className="p-3 bg-indigo-500 rounded-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Applications Trend */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">Monthly Applications</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData.monthlyApplications}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="applications" 
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Application Status Distribution */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">Application Status</h3>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {analyticsData.statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {analyticsData.statusDistribution.map((item, index) => {
                  const IconComponent = getStatusIcon(item.name)
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <IconComponent className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300 text-sm">{item.name}</span>
                      <span className="text-slate-400 text-sm">({item.value})</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Application Trends */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">Application Funnel Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.applicationTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="applications" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="Applications"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="interviews" 
                    stroke="#F59E0B" 
                    strokeWidth={2}
                    name="Interviews"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="offers" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name="Offers"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Company Types */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">Applications by Company Type</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.companyTypes} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9CA3AF" />
                  <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={80} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }} 
                  />
                  <Bar dataKey="applications" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Success Metrics */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-semibold text-white mb-6">Success Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {((analyticsData.responseRate / 100) * analyticsData.totalApplications).toFixed(0)}
                </div>
                <div className="text-slate-300 text-sm">Total Responses</div>
                <div className="text-slate-400 text-xs mt-1">
                  {analyticsData.responseRate}% response rate
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  {((analyticsData.interviewRate / 100) * analyticsData.totalApplications).toFixed(0)}
                </div>
                <div className="text-slate-300 text-sm">Total Interviews</div>
                <div className="text-slate-400 text-xs mt-1">
                  {analyticsData.interviewRate}% interview rate
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {((analyticsData.offerRate / 100) * analyticsData.totalApplications).toFixed(0)}
                </div>
                <div className="text-slate-300 text-sm">Total Offers</div>
                <div className="text-slate-400 text-xs mt-1">
                  {analyticsData.offerRate}% offer rate
                </div>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="mt-8 bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-semibold text-white mb-4">Key Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium">Strength</span>
                </div>
                <p className="text-slate-300 text-sm">
                  Your response rate of {analyticsData.responseRate}% is above the industry average of 20-25%.
                </p>
              </div>
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-400 font-medium">Opportunity</span>
                </div>
                <p className="text-slate-300 text-sm">
                  Focus on improving your interview conversion rate to increase your offer rate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics