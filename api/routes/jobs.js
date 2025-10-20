import express from 'express'
import { getSupabaseClient } from '../config/supabase.js'
const router = express.Router()

// Initialize Supabase client
const supabase = getSupabaseClient()

// Get all job applications for a user
router.get('/', async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user' // For demo purposes

    const { data: applications, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching applications:', error)
      return res.status(500).json({ error: 'Failed to fetch applications' })
    }

    res.json({ applications: applications || [] })
  } catch (error) {
    console.error('Error in GET /jobs:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Create a new job application
router.post('/', async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user' // For demo purposes
    const {
      jobTitle,
      companyName,
      location,
      salary,
      jobType,
      status,
      appliedDate,
      notes,
      jobUrl,
      contactPerson,
      contactEmail,
      interviewDate,
      followUpDate
    } = req.body

    // Validate required fields
    if (!jobTitle || !companyName) {
      return res.status(400).json({ error: 'Job title and company name are required' })
    }

    const applicationData = {
      user_id: userId,
      job_title: jobTitle,
      company_name: companyName,
      location: location || null,
      salary: salary || null,
      job_type: jobType || 'full-time',
      status: status || 'applied',
      applied_date: appliedDate || new Date().toISOString().split('T')[0],
      notes: notes || null,
      job_url: jobUrl || null,
      contact_person: contactPerson || null,
      contact_email: contactEmail || null,
      interview_date: interviewDate || null,
      follow_up_date: followUpDate || null
    }

    const { data: application, error } = await supabase
      .from('job_applications')
      .insert([applicationData])
      .select()
      .single()

    if (error) {
      console.error('Error creating application:', error)
      return res.status(500).json({ error: 'Failed to create application' })
    }

    // Convert snake_case to camelCase for frontend
    const formattedApplication = {
      id: application.id,
      jobTitle: application.job_title,
      companyName: application.company_name,
      location: application.location,
      salary: application.salary,
      jobType: application.job_type,
      status: application.status,
      appliedDate: application.applied_date,
      notes: application.notes,
      jobUrl: application.job_url,
      contactPerson: application.contact_person,
      contactEmail: application.contact_email,
      interviewDate: application.interview_date,
      followUpDate: application.follow_up_date
    }

    res.status(201).json({ application: formattedApplication })
  } catch (error) {
    console.error('Error in POST /jobs:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update a job application
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user?.id || 'demo-user' // For demo purposes
    const {
      jobTitle,
      companyName,
      location,
      salary,
      jobType,
      status,
      appliedDate,
      notes,
      jobUrl,
      contactPerson,
      contactEmail,
      interviewDate,
      followUpDate
    } = req.body

    // Validate required fields
    if (!jobTitle || !companyName) {
      return res.status(400).json({ error: 'Job title and company name are required' })
    }

    const updateData = {
      job_title: jobTitle,
      company_name: companyName,
      location: location || null,
      salary: salary || null,
      job_type: jobType || 'full-time',
      status: status || 'applied',
      applied_date: appliedDate,
      notes: notes || null,
      job_url: jobUrl || null,
      contact_person: contactPerson || null,
      contact_email: contactEmail || null,
      interview_date: interviewDate || null,
      follow_up_date: followUpDate || null,
      updated_at: new Date().toISOString()
    }

    const { data: application, error } = await supabase
      .from('job_applications')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating application:', error)
      return res.status(500).json({ error: 'Failed to update application' })
    }

    if (!application) {
      return res.status(404).json({ error: 'Application not found' })
    }

    // Convert snake_case to camelCase for frontend
    const formattedApplication = {
      id: application.id,
      jobTitle: application.job_title,
      companyName: application.company_name,
      location: application.location,
      salary: application.salary,
      jobType: application.job_type,
      status: application.status,
      appliedDate: application.applied_date,
      notes: application.notes,
      jobUrl: application.job_url,
      contactPerson: application.contact_person,
      contactEmail: application.contact_email,
      interviewDate: application.interview_date,
      followUpDate: application.follow_up_date
    }

    res.json({ application: formattedApplication })
  } catch (error) {
    console.error('Error in PUT /jobs/:id:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Delete a job application
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user?.id || 'demo-user' // For demo purposes

    const { error } = await supabase
      .from('job_applications')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting application:', error)
      return res.status(500).json({ error: 'Failed to delete application' })
    }

    res.json({ message: 'Application deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE /jobs/:id:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get analytics data
router.get('/analytics', async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user' // For demo purposes
    const { range = '6months' } = req.query

    // Calculate date range
    const now = new Date()
    let startDate = new Date()
    
    switch (range) {
      case '3months':
        startDate.setMonth(now.getMonth() - 3)
        break
      case '6months':
        startDate.setMonth(now.getMonth() - 6)
        break
      case '1year':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      case 'all':
        startDate = new Date('2020-01-01')
        break
      default:
        startDate.setMonth(now.getMonth() - 6)
    }

    const { data: applications, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('user_id', userId)
      .gte('applied_date', startDate.toISOString().split('T')[0])
      .order('applied_date', { ascending: true })

    if (error) {
      console.error('Error fetching analytics:', error)
      return res.status(500).json({ error: 'Failed to fetch analytics data' })
    }

    const apps = applications || []
    
    // Calculate metrics
    const totalApplications = apps.length
    const responseCount = apps.filter(app => ['interview', 'offer', 'rejected'].includes(app.status)).length
    const interviewCount = apps.filter(app => ['interview', 'offer'].includes(app.status)).length
    const offerCount = apps.filter(app => app.status === 'offer').length
    
    const responseRate = totalApplications > 0 ? Math.round((responseCount / totalApplications) * 100) : 0
    const interviewRate = totalApplications > 0 ? Math.round((interviewCount / totalApplications) * 100) : 0
    const offerRate = totalApplications > 0 ? Math.round((offerCount / totalApplications) * 100) : 0
    
    // Calculate average response time (mock data for now)
    const averageResponseTime = 12

    // Monthly applications
    const monthlyData = {}
    apps.forEach(app => {
      const date = new Date(app.applied_date)
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' })
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1
    })

    const monthlyApplications = Object.entries(monthlyData)
      .map(([month, applications]) => ({ month, applications }))
      .slice(-6) // Last 6 months

    // Status distribution
    const statusCounts = {
      applied: apps.filter(app => app.status === 'applied').length,
      interview: apps.filter(app => app.status === 'interview').length,
      offer: apps.filter(app => app.status === 'offer').length,
      rejected: apps.filter(app => app.status === 'rejected').length,
      withdrawn: apps.filter(app => app.status === 'withdrawn').length
    }

    const statusDistribution = [
      { name: 'Applied', value: statusCounts.applied, color: '#3B82F6' },
      { name: 'Interview', value: statusCounts.interview, color: '#F59E0B' },
      { name: 'Offer', value: statusCounts.offer, color: '#10B981' },
      { name: 'Rejected', value: statusCounts.rejected, color: '#EF4444' },
      { name: 'Withdrawn', value: statusCounts.withdrawn, color: '#6B7280' }
    ]

    // Company types (mock data for now)
    const companyTypes = [
      { name: 'Tech Startups', applications: Math.floor(totalApplications * 0.4) },
      { name: 'Enterprise', applications: Math.floor(totalApplications * 0.25) },
      { name: 'Mid-size', applications: Math.floor(totalApplications * 0.2) },
      { name: 'Consulting', applications: Math.floor(totalApplications * 0.1) },
      { name: 'Finance', applications: Math.floor(totalApplications * 0.05) }
    ]

    // Application trends (simplified)
    const trendData = {}
    apps.forEach(app => {
      const monthKey = new Date(app.applied_date).toISOString().slice(0, 7)
      if (!trendData[monthKey]) {
        trendData[monthKey] = { applications: 0, interviews: 0, offers: 0 }
      }
      trendData[monthKey].applications++
      if (['interview', 'offer'].includes(app.status)) trendData[monthKey].interviews++
      if (app.status === 'offer') trendData[monthKey].offers++
    })

    const applicationTrends = Object.entries(trendData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([date, data]) => ({ date, ...data }))

    const analyticsData = {
      totalApplications,
      responseRate,
      interviewRate,
      offerRate,
      averageResponseTime,
      monthlyApplications,
      statusDistribution,
      companyTypes,
      applicationTrends
    }

    res.json(analyticsData)
  } catch (error) {
    console.error('Error in GET /jobs/analytics:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get application statistics
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-user' // For demo purposes

    const { data: applications, error } = await supabase
      .from('job_applications')
      .select('status, applied_date')
      .eq('user_id', userId)

    if (error) {
      console.error('Error fetching stats:', error)
      return res.status(500).json({ error: 'Failed to fetch statistics' })
    }

    // Calculate statistics
    const stats = {
      total: applications.length,
      applied: applications.filter(app => app.status === 'applied').length,
      interview: applications.filter(app => app.status === 'interview').length,
      offer: applications.filter(app => app.status === 'offer').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
      withdrawn: applications.filter(app => app.status === 'withdrawn').length
    }

    // Calculate monthly application trends
    const monthlyData = {}
    applications.forEach(app => {
      const month = new Date(app.applied_date).toISOString().slice(0, 7) // YYYY-MM
      monthlyData[month] = (monthlyData[month] || 0) + 1
    })

    const trends = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({ month, count }))

    res.json({ stats, trends })
  } catch (error) {
    console.error('Error in GET /jobs/stats:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router