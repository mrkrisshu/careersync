import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Chrome } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'sonner'

const Register = () => {
  const [loading, setLoading] = useState(false)
  const { signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  const handleGoogleSignUp = async () => {
    setLoading(true)
    try {
      const { error } = await signInWithGoogle()
      if (error) {
        toast.error(error.message || 'Failed to sign up with Google')
      } else {
        toast.success('Welcome! Your account has been created.')
        navigate('/dashboard')
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-white">⚡</span>
            </div>
            <span className="text-2xl font-bold text-white">CareerSync</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Get Started</h1>
          <p className="text-slate-300 text-lg">Your AI-powered career companion</p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-700">
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-slate-300 mb-6">Create your account with Google in seconds</p>
              
              <button
                onClick={handleGoogleSignUp}
                disabled={loading}
                className="w-full flex items-center justify-center px-6 py-4 border border-slate-600 rounded-lg shadow-sm bg-slate-700 hover:bg-slate-600 text-base font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed gap-3"
              >
                <Chrome className="w-6 h-6" />
                {loading ? 'Creating account...' : 'Sign Up with Google'}
              </button>
            </div>

            {/* Features */}
            <div className="mt-8 pt-8 border-t border-slate-700 space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-md bg-blue-600">
                    <span className="text-white text-sm">✓</span>
                  </div>
                </div>
                <p className="text-sm text-slate-300">No password needed - quick and secure</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-md bg-blue-600">
                    <span className="text-white text-sm">✓</span>
                  </div>
                </div>
                <p className="text-sm text-slate-300">Use your existing Google account</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-md bg-blue-600">
                    <span className="text-white text-sm">✓</span>
                  </div>
                </div>
                <p className="text-sm text-slate-300">Instant access to all features</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-md bg-blue-600">
                    <span className="text-white text-sm">✓</span>
                  </div>
                </div>
                <p className="text-sm text-slate-300">Secure OAuth 2.0 authentication</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-slate-400">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}

export default Register