import React, { useState, useEffect } from 'react'
import { 
  FileText, 
  Target, 
  Briefcase, 
  TrendingUp, 
  Plus,
  ArrowRight,
  Calendar,
  Clock,
  CheckCircle
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

interface DashboardStats {
  totalResumes: number
  avgATSScore: number
  totalApplications: number
  interviewsScheduled: number
}

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalResumes: 0,
    avgATSScore: 0,
    totalApplications: 0,
    interviewsScheduled: 0
  })
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      // Fetch resumes count and average ATS score
      const { data: resumes, error: resumesError } = await supabase
        .from('resumes')
        .select('ats_score')
        .eq('user_id', user?.id)

      if (resumesError) throw resumesError

      // Fetch applications count
      const { data: applications, error: applicationsError } = await supabase
        .from('applications')
        .select('status')
        .eq('user_id', user?.id)

      if (applicationsError) throw applicationsError

      // Calculate stats
      const totalResumes = resumes?.length || 0
      const avgATSScore = resumes?.length 
        ? Math.round(resumes.reduce((sum, resume) => sum + (resume.ats_score || 0), 0) / resumes.length)
        : 0
      const totalApplications = applications?.length || 0
      const interviewsScheduled = applications?.filter(app => app.status === 'interviewing').length || 0

      setStats({
        totalResumes,
        avgATSScore,
        totalApplications,
        interviewsScheduled
      })

      // Mock recent activity for now
      setRecentActivity([
        {
          id: 1,
          type: 'resume',
          title: 'Software Engineer Resume',
          action: 'Updated ATS score to 85%',
          time: '2 hours ago',
          icon: FileText
        },
        {
          id: 2,
          type: 'application',
          title: 'Frontend Developer at TechCorp',
          action: 'Application submitted',
          time: '1 day ago',
          icon: Briefcase
        },
        {
          id: 3,
          type: 'interview',
          title: 'Senior Developer Interview',
          action: 'Interview scheduled',
          time: '2 days ago',
          icon: Calendar
        }
      ])

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Resumes',
      value: stats.totalResumes,
      icon: FileText,
      color: 'bg-blue-500',
      link: '/resume-builder'
    },
    {
      title: 'Avg ATS Score',
      value: `${stats.avgATSScore}%`,
      icon: Target,
      color: 'bg-green-500',
      link: '/ats-analysis'
    },
    {
      title: 'Applications',
      value: stats.totalApplications,
      icon: Briefcase,
      color: 'bg-purple-500',
      link: '/job-tracker'
    },
    {
      title: 'Interviews',
      value: stats.interviewsScheduled,
      icon: TrendingUp,
      color: 'bg-orange-500',
      link: '/analytics'
    }
  ]

  const quickActions = [
    {
      title: 'Create New Resume',
      description: 'Build and optimize a new resume',
      icon: FileText,
      link: '/resume-builder',
      color: 'bg-slate-700 text-blue-400 border-slate-600 hover:bg-slate-600'
    },
    {
      title: 'Analyze ATS Score',
      description: 'Check resume compatibility',
      icon: Target,
      link: '/ats-analysis',
      color: 'bg-slate-700 text-green-400 border-slate-600 hover:bg-slate-600'
    },
    {
      title: 'Generate Cover Letter',
      description: 'Create personalized cover letters',
      icon: FileText,
      link: '/cover-letter',
      color: 'bg-slate-700 text-purple-400 border-slate-600 hover:bg-slate-600'
    },
    {
      title: 'Track Applications',
      description: 'Manage your job applications',
      icon: Briefcase,
      link: '/job-tracker',
      color: 'bg-slate-700 text-orange-400 border-slate-600 hover:bg-slate-600'
    }
  ]

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-900">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.user_metadata?.name || user?.email}!
            </h1>
            <p className="text-slate-300">
              Here's your career optimization overview
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((card, index) => (
              <Link
                key={index}
                to={card.link}
                className="bg-slate-800 rounded-xl shadow-sm p-6 hover:shadow-lg hover:bg-slate-700 transition-all border border-slate-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-300 mb-1">{card.title}</p>
                    <p className="text-3xl font-bold text-white">{card.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Quick Actions */}
            <div className="bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
              <div className="space-y-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className={`flex items-center p-4 rounded-lg border-2 ${action.color} transition-all`}
                  >
                    <action.icon className="w-8 h-8 mr-4" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{action.title}</h3>
                      <p className="text-sm text-slate-300">{action.description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                        <activity.icon className="w-5 h-5 text-slate-300" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-white">{activity.title}</h3>
                        <p className="text-sm text-slate-300">{activity.action}</p>
                        <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-300">No recent activity</p>
                    <p className="text-sm text-slate-400">Start by creating your first resume!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Getting Started */}
          {stats.totalResumes === 0 && (
            <div className="mt-8 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-8 border border-slate-600">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Get Started with CareerSync
                </h3>
                <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                  Welcome to CareerSync! Start by creating your first resume and let our AI help you optimize it for better job opportunities.
                </p>
                <Link
                  to="/resume-builder"
                  className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Create Your First Resume
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard