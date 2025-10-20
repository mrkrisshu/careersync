import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'sonner'

const AuthCallback = () => {
  const navigate = useNavigate()
  const { exchangeCodeForToken } = useAuth()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')
        const error = params.get('error')

        if (error) {
          toast.error(`Authentication failed: ${error}`)
          navigate('/login')
          return
        }

        if (!code) {
          toast.error('No authorization code received')
          navigate('/login')
          return
        }

        const { error: authError } = await exchangeCodeForToken(code)

        if (authError) {
          toast.error(`Authentication error: ${authError.message}`)
          navigate('/login')
          return
        }

        toast.success('Successfully signed in!')
        navigate('/dashboard')
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error'
        toast.error(`Error: ${errorMsg}`)
        navigate('/login')
      }
    }

    handleCallback()
  }, [exchangeCodeForToken, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-white">Signing you in...</h1>
        <p className="text-slate-300 mt-2">Please wait while we complete your authentication</p>
      </div>
    </div>
  )
}

export default AuthCallback
