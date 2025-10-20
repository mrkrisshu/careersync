import { useState, useEffect } from 'react'

export interface User {
  id: string
  email: string
  name: string
  picture: string
  iat: number
  exp: number
}

const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID' // Will be set from env

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in (from localStorage or URL params)
    const checkAuthStatus = async () => {
      // Check localStorage for existing token
      const token = localStorage.getItem('google_token')
      if (token) {
        try {
          const decoded = parseJwt(token)
          if (decoded && decoded.exp * 1000 > Date.now()) {
            setUser(decoded as User)
          } else {
            localStorage.removeItem('google_token')
          }
        } catch {
          localStorage.removeItem('google_token')
        }
      }

      // Check for auth code from redirect
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')
      if (code && !token) {
        // Code exists but no token - exchange will happen on next page load
      }

      setLoading(false)
    }

    checkAuthStatus()
  }, [])

  const signInWithGoogle = async () => {
    try {
      // Get Google Client ID from environment
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID
      
      if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID') {
        throw new Error(
          'Google Client ID not configured. Please add VITE_GOOGLE_CLIENT_ID to your .env file'
        )
      }

      const redirectUri = `${window.location.origin}/auth/callback`
      
      const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
      authUrl.searchParams.append('client_id', clientId)
      authUrl.searchParams.append('redirect_uri', redirectUri)
      authUrl.searchParams.append('response_type', 'code')
      authUrl.searchParams.append('scope', 'openid email profile')
      authUrl.searchParams.append('access_type', 'offline')

      // Redirect to Google OAuth
      window.location.href = authUrl.toString()
      
      return { data: null, error: null }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      return { data: null, error }
    }
  }

  const exchangeCodeForToken = async (code: string) => {
    try {
      // Call your backend to exchange code for token
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed')
      }

      // Store token
      localStorage.setItem('google_token', data.token)
      
      // Decode and set user
      const decoded = parseJwt(data.token)
      setUser(decoded as User)
      
      return { data, error: null }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      localStorage.removeItem('google_token')
      setUser(null)
      return { error: null }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      return { error }
    }
  }

  return {
    user,
    loading,
    signInWithGoogle,
    exchangeCodeForToken,
    signOut,
  }
}

// Helper function to parse JWT
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (err) {
    console.error('Failed to parse JWT:', err)
    return null
  }
}