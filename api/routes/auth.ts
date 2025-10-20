/**
 * Google OAuth Authentication API
 * Handle Google OAuth callback and token generation
 */
import { Router, type Request, type Response } from 'express'
import jwt from 'jsonwebtoken'

const router = Router()

/**
 * Exchange Google Authorization Code for JWT
 * POST /api/auth/google
 */
router.post('/google', async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.body

    if (!code) {
      res.status(400).json({ message: 'Authorization code is required' })
      return
    }

    // Exchange code for tokens using Google's API
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirect_uri: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback`,
        grant_type: 'authorization_code',
      }).toString(),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      console.error('Google token error:', tokenData)
      res.status(400).json({ message: 'Failed to exchange code for token' })
      return
    }

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })

    const userData = await userResponse.json()

    if (!userResponse.ok) {
      console.error('Google user info error:', userData)
      res.status(400).json({ message: 'Failed to get user info' })
      return
    }

    // Create JWT token for our app
    const appToken = jwt.sign(
      {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    res.json({ token: appToken, user: userData })
  } catch (error) {
    console.error('Auth error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

export default router
