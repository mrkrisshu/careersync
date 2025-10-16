import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  name: string
  api_key_encrypted?: string
  created_at: string
  updated_at: string
}

export interface Resume {
  id: string
  user_id: string
  title: string
  resume_text: string
  ats_score: number
  analysis?: any
  file_url?: string
  created_at: string
  updated_at: string
}

export interface Job {
  id: string
  user_id: string
  jd_text: string
  company: string
  title: string
  job_url?: string
  created_at: string
}

export interface Application {
  id: string
  user_id: string
  job_id: string
  resume_id: string
  status: 'applied' | 'interviewing' | 'offer' | 'rejected'
  ats_score: number
  notes?: string
  applied_date: string
  created_at: string
  updated_at: string
}

export interface Improvement {
  id: string
  resume_id: string
  suggestion: string
  action_type: string
  applied: boolean
  created_at: string
}

export interface SkillMissing {
  id: string
  resume_id: string
  skill: string
  course_link?: string
  platform?: string
  created_at: string
}