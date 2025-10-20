import express from 'express'
import { getSupabaseClient } from '../config/supabase.js'
import { GoogleGenerativeAI } from '@google/generative-ai'

const router = express.Router()

// Initialize Supabase client
const supabase = getSupabaseClient()

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user' // For demo purposes
    
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error)
      return res.status(500).json({ error: 'Failed to fetch profile' })
    }

    // Return default profile if none exists
    const defaultProfile = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      bio: 'Experienced software developer passionate about creating innovative solutions.'
    }

    res.json(profile || defaultProfile)
  } catch (error) {
    console.error('Error in GET /user/profile:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user' // For demo purposes
    const { name, email, phone, location, bio } = req.body

    const profileData = {
      user_id: userId,
      name,
      email,
      phone,
      location,
      bio,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(profileData, { onConflict: 'user_id' })
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      return res.status(500).json({ error: 'Failed to update profile' })
    }

    res.json(data)
  } catch (error) {
    console.error('Error in PUT /user/profile:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get API keys (masked)
router.get('/api-keys', async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user' // For demo purposes
    
    const { data: keys, error } = await supabase
      .from('user_api_keys')
      .select('gemini_key, openai_key')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching API keys:', error)
      return res.status(500).json({ error: 'Failed to fetch API keys' })
    }

    // Mask the keys for security
    const maskedKeys = {
      geminiKey: keys?.gemini_key ? `${keys.gemini_key.substring(0, 8)}...` : '',
      openaiKey: keys?.openai_key ? `${keys.openai_key.substring(0, 8)}...` : ''
    }

    res.json(maskedKeys)
  } catch (error) {
    console.error('Error in GET /user/api-keys:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update API keys
router.put('/api-keys', async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user' // For demo purposes
    const { geminiKey, openaiKey } = req.body

    const keysData = {
      user_id: userId,
      gemini_key: geminiKey,
      openai_key: openaiKey,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('user_api_keys')
      .upsert(keysData, { onConflict: 'user_id' })
      .select()
      .single()

    if (error) {
      console.error('Error updating API keys:', error)
      return res.status(500).json({ error: 'Failed to update API keys' })
    }

    res.json({ message: 'API keys updated successfully' })
  } catch (error) {
    console.error('Error in PUT /user/api-keys:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Test API key
router.post('/test-api-key', async (req, res) => {
  try {
    const { provider, key } = req.body

    if (!key) {
      return res.status(400).json({ error: 'API key is required' })
    }

    if (provider === 'gemini') {
      try {
        const genAI = new GoogleGenerativeAI(key)
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
        
        const result = await model.generateContent('Test message')
        const response = await result.response
        
        if (response.text()) {
          res.json({ valid: true, message: 'Gemini API key is valid' })
        } else {
          res.status(400).json({ valid: false, message: 'Invalid Gemini API key' })
        }
      } catch (error) {
        res.status(400).json({ valid: false, message: 'Invalid Gemini API key' })
      }
    } else if (provider === 'openai') {
      try {
        const response = await fetch('https://api.openai.com/v1/models', {
          headers: {
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          res.json({ valid: true, message: 'OpenAI API key is valid' })
        } else {
          res.status(400).json({ valid: false, message: 'Invalid OpenAI API key' })
        }
      } catch (error) {
        res.status(400).json({ valid: false, message: 'Invalid OpenAI API key' })
      }
    } else {
      res.status(400).json({ error: 'Unsupported provider' })
    }
  } catch (error) {
    console.error('Error in POST /user/test-api-key:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get notification settings
router.get('/notifications', async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user' // For demo purposes
    
    const { data: settings, error } = await supabase
      .from('user_notification_settings')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching notification settings:', error)
      return res.status(500).json({ error: 'Failed to fetch notification settings' })
    }

    // Return default settings if none exist
    const defaultSettings = {
      emailNotifications: true,
      pushNotifications: false,
      jobAlerts: true,
      weeklyReports: true
    }

    res.json(settings || defaultSettings)
  } catch (error) {
    console.error('Error in GET /user/notifications:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update notification settings
router.put('/notifications', async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user' // For demo purposes
    const { emailNotifications, pushNotifications, jobAlerts, weeklyReports } = req.body

    const settingsData = {
      user_id: userId,
      email_notifications: emailNotifications,
      push_notifications: pushNotifications,
      job_alerts: jobAlerts,
      weekly_reports: weeklyReports,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('user_notification_settings')
      .upsert(settingsData, { onConflict: 'user_id' })
      .select()
      .single()

    if (error) {
      console.error('Error updating notification settings:', error)
      return res.status(500).json({ error: 'Failed to update notification settings' })
    }

    res.json(data)
  } catch (error) {
    console.error('Error in PUT /user/notifications:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router