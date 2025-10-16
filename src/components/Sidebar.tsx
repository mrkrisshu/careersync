import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  FileText, 
  Target, 
  Mail, 
  Briefcase, 
  BarChart3, 
  Settings, 
  LogOut,
  Zap
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'sonner'

const Sidebar = () => {
  const location = useLocation()
  const { signOut } = useAuth()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Resume Builder', href: '/resume-builder', icon: FileText },
    { name: 'ATS Analysis', href: '/ats-analysis', icon: Target },
    { name: 'Cover Letter', href: '/cover-letter', icon: Mail },
    { name: 'Job Tracker', href: '/job-tracker', icon: Briefcase },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out successfully')
    } catch (error) {
      toast.error('Error signing out')
    }
  }

  return (
    <div className="flex flex-col w-64 bg-slate-800 shadow-lg h-screen border-r border-slate-700">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-slate-700">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <span className="ml-3 text-xl font-bold text-white">CareerSync</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white border-r-2 border-blue-400'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <item.icon className={`mr-3 w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Sign Out */}
      <div className="px-4 py-4 border-t border-slate-700">
        <button
          onClick={handleSignOut}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white transition-colors"
        >
          <LogOut className="mr-3 w-5 h-5 text-slate-400" />
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default Sidebar