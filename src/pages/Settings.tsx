import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { User, Key, Bell, Shield, Save, Eye, EyeOff, Check, X } from 'lucide-react'
import { toast } from 'sonner'

interface UserProfile {
  name: string
  email: string
  phone: string
  location: string
  bio: string
}

interface APIKeys {
  geminiKey: string
  openaiKey: string
}

interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  jobAlerts: boolean
  weeklyReports: boolean
}

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [showApiKeys, setShowApiKeys] = useState(false)
  
  // Profile state
  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Experienced software developer passionate about creating innovative solutions.'
  })

  // API Keys state
  const [apiKeys, setApiKeys] = useState<APIKeys>({
    geminiKey: '',
    openaiKey: ''
  })

  // Notifications state
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: false,
    jobAlerts: true,
    weeklyReports: true
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      // Load user profile
      const profileResponse = await fetch('/api/user/profile')
      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        setProfile(profileData)
      }

      // Load API keys (masked)
      const keysResponse = await fetch('/api/user/api-keys')
      if (keysResponse.ok) {
        const keysData = await keysResponse.json()
        setApiKeys(keysData)
      }

      // Load notification settings
      const notifResponse = await fetch('/api/user/notifications')
      if (notifResponse.ok) {
        const notifData = await notifResponse.json()
        setNotifications(notifData)
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }

  const saveProfile = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      })

      if (response.ok) {
        toast.success('Profile updated successfully!')
      } else {
        toast.error('Failed to update profile')
      }
    } catch (error) {
      toast.error('Error updating profile')
    } finally {
      setLoading(false)
    }
  }

  const saveApiKeys = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/user/api-keys', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiKeys)
      })

      if (response.ok) {
        toast.success('API keys updated successfully!')
      } else {
        toast.error('Failed to update API keys')
      }
    } catch (error) {
      toast.error('Error updating API keys')
    } finally {
      setLoading(false)
    }
  }

  const saveNotifications = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/user/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notifications)
      })

      if (response.ok) {
        toast.success('Notification settings updated!')
      } else {
        toast.error('Failed to update notification settings')
      }
    } catch (error) {
      toast.error('Error updating notification settings')
    } finally {
      setLoading(false)
    }
  }

  const testApiKey = async (provider: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/user/test-api-key`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, key: provider === 'gemini' ? apiKeys.geminiKey : apiKeys.openaiKey })
      })

      if (response.ok) {
        toast.success(`${provider} API key is valid!`)
      } else {
        toast.error(`${provider} API key is invalid`)
      }
    } catch (error) {
      toast.error(`Error testing ${provider} API key`)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'api-keys', label: 'API Keys', icon: Key },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield }
  ]

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
        
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-64 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Content Area */}
          <div className="flex-1 max-w-2xl">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
                <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <button
                    onClick={saveProfile}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </div>
            )}

            {/* API Keys Tab */}
            {activeTab === 'api-keys' && (
              <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">API Keys</h2>
                  <button
                    onClick={() => setShowApiKeys(!showApiKeys)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600"
                  >
                    {showApiKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showApiKeys ? 'Hide' : 'Show'} Keys
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Gemini API Key
                    </label>
                    <div className="flex gap-2">
                      <input
                        type={showApiKeys ? 'text' : 'password'}
                        value={apiKeys.geminiKey}
                        onChange={(e) => setApiKeys({ ...apiKeys, geminiKey: e.target.value })}
                        placeholder="Enter your Gemini API key"
                        className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => testApiKey('gemini')}
                        disabled={!apiKeys.geminiKey || loading}
                        className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Test
                      </button>
                    </div>
                    <p className="text-sm text-slate-400 mt-2">
                      Used for resume analysis, tailoring, and cover letter generation
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      OpenAI API Key (Optional)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type={showApiKeys ? 'text' : 'password'}
                        value={apiKeys.openaiKey}
                        onChange={(e) => setApiKeys({ ...apiKeys, openaiKey: e.target.value })}
                        placeholder="Enter your OpenAI API key (optional)"
                        className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => testApiKey('openai')}
                        disabled={!apiKeys.openaiKey || loading}
                        className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Test
                      </button>
                    </div>
                    <p className="text-sm text-slate-400 mt-2">
                      Alternative AI provider for enhanced features
                    </p>
                  </div>

                  <button
                    onClick={saveApiKeys}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? 'Saving...' : 'Save API Keys'}
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
                <h2 className="text-2xl font-bold text-white mb-6">Notification Preferences</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-white">Email Notifications</h3>
                      <p className="text-sm text-slate-400">Receive updates via email</p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, emailNotifications: !notifications.emailNotifications })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications.emailNotifications ? 'bg-blue-600' : 'bg-slate-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-white">Push Notifications</h3>
                      <p className="text-sm text-slate-400">Receive browser notifications</p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, pushNotifications: !notifications.pushNotifications })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications.pushNotifications ? 'bg-blue-600' : 'bg-slate-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-white">Job Alerts</h3>
                      <p className="text-sm text-slate-400">Get notified about new job opportunities</p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, jobAlerts: !notifications.jobAlerts })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications.jobAlerts ? 'bg-blue-600' : 'bg-slate-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications.jobAlerts ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-white">Weekly Reports</h3>
                      <p className="text-sm text-slate-400">Receive weekly application summaries</p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, weeklyReports: !notifications.weeklyReports })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications.weeklyReports ? 'bg-blue-600' : 'bg-slate-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications.weeklyReports ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <button
                    onClick={saveNotifications}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
                <h2 className="text-2xl font-bold text-white mb-6">Security Settings</h2>
                
                <div className="space-y-6">
                  <div className="p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-white font-medium">Two-Factor Authentication</span>
                    </div>
                    <p className="text-sm text-slate-400">
                      Your account is protected with 2FA via Supabase Auth
                    </p>
                  </div>

                  <div className="p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-white font-medium">Secure Data Storage</span>
                    </div>
                    <p className="text-sm text-slate-400">
                      All your data is encrypted and stored securely in Supabase
                    </p>
                  </div>

                  <div className="p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-white font-medium">API Key Encryption</span>
                    </div>
                    <p className="text-sm text-slate-400">
                      Your API keys are encrypted before storage
                    </p>
                  </div>

                  <div className="border-t border-slate-600 pt-6">
                    <h3 className="text-lg font-medium text-white mb-4">Account Actions</h3>
                    <div className="space-y-3">
                      <button className="w-full px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-left">
                        Change Password
                      </button>
                      <button className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 text-left">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings