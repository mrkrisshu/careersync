/**
 * Demo Auth Service
 * Use this for testing while setting up Google OAuth
 * 
 * Once Google OAuth is configured, remove this file and the app
 * will work with real authentication
 */

export interface DemoUser {
  id: string
  email: string
  name: string
}

const DEMO_USERS = {
  'demo@example.com': {
    id: 'demo-user-1',
    email: 'demo@example.com',
    name: 'Demo User',
  },
}

export const demoAuthService = {
  /**
   * Login a demo user
   */
  login: (email: string): DemoUser | null => {
    const user = DEMO_USERS[email as keyof typeof DEMO_USERS]
    if (user) {
      localStorage.setItem('demo_user', JSON.stringify(user))
      return user
    }
    return null
  },

  /**
   * Get current demo user
   */
  getCurrentUser: (): DemoUser | null => {
    const user = localStorage.getItem('demo_user')
    return user ? JSON.parse(user) : null
  },

  /**
   * Logout demo user
   */
  logout: (): void => {
    localStorage.removeItem('demo_user')
  },

  /**
   * Check if demo mode is active
   */
  isDemoMode: (): boolean => {
    return localStorage.getItem('demo_mode') === 'true'
  },

  /**
   * Enable demo mode
   */
  enableDemoMode: (): void => {
    localStorage.setItem('demo_mode', 'true')
  },

  /**
   * Disable demo mode
   */
  disableDemoMode: (): void => {
    localStorage.removeItem('demo_mode')
  },
}
