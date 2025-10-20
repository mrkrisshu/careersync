import express from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'

const router = express.Router()

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Generate cover letter using AI
const generateCoverLetterWithAI = async (formData) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    const toneInstructions = {
      professional: 'Use a professional, formal tone that is respectful and business-appropriate.',
      enthusiastic: 'Use an energetic, passionate tone that shows excitement and motivation.',
      creative: 'Use a unique, innovative approach with creative language while maintaining professionalism.',
      formal: 'Use a traditional, conservative tone with formal language and structure.'
    }
    
    const prompt = `
    Generate a professional cover letter based on the following information:
    
    Personal Information:
    - Name: ${formData.personalInfo.name}
    - Email: ${formData.personalInfo.email}
    - Phone: ${formData.personalInfo.phone}
    - Address: ${formData.personalInfo.address}
    
    Job Information:
    - Job Title: ${formData.jobTitle}
    - Company Name: ${formData.companyName}
    - Job Description: ${formData.jobDescription}
    
    Additional Information:
    - Relevant Experience: ${formData.experience}
    - Key Skills: ${formData.skills}
    - Notable Achievements: ${formData.achievements}
    
    Writing Style: ${toneInstructions[formData.tone]}
    
    Please create a compelling cover letter that:
    1. Starts with proper contact information and date
    2. Addresses the hiring manager professionally
    3. Has a strong opening paragraph that grabs attention
    4. Highlights relevant experience and skills that match the job requirements
    5. Showcases specific achievements and accomplishments
    6. Demonstrates knowledge about the company (if job description is provided)
    7. Explains why the candidate is a perfect fit for the role
    8. Ends with a professional closing and call to action
    9. Maintains the specified tone throughout
    10. Is approximately 3-4 paragraphs long
    
    Format the cover letter properly with appropriate spacing and professional structure.
    Make it personalized, engaging, and tailored to the specific job and company.
    
    Return only the cover letter content without any additional commentary.
    `
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Error generating cover letter:', error)
    throw new Error('Failed to generate cover letter with AI')
  }
}

// Generate cover letter endpoint
router.post('/generate', async (req, res) => {
  try {
    const formData = req.body
    
    // Validate required fields
    if (!formData.jobTitle || !formData.companyName || !formData.personalInfo?.name) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'Job title, company name, and personal name are required' 
      })
    }

    // Generate cover letter with AI
    const coverLetter = await generateCoverLetterWithAI(formData)

    res.json({
      success: true,
      coverLetter,
      message: 'Cover letter generated successfully'
    })
  } catch (error) {
    console.error('Cover letter generation error:', error)
    res.status(500).json({ 
      error: 'Failed to generate cover letter',
      message: error.message 
    })
  }
})

// Get cover letter templates endpoint
router.get('/templates', (req, res) => {
  const templates = [
    {
      id: 'professional',
      name: 'Professional',
      description: 'A formal, business-appropriate template',
      tone: 'professional',
      preview: 'Dear Hiring Manager,\n\nI am writing to express my strong interest in the [Job Title] position at [Company Name]...'
    },
    {
      id: 'enthusiastic',
      name: 'Enthusiastic',
      description: 'An energetic template showing passion',
      tone: 'enthusiastic',
      preview: 'Dear Hiring Team,\n\nI am thrilled to apply for the [Job Title] role at [Company Name]! Your company\'s mission...'
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'A unique approach for creative roles',
      tone: 'creative',
      preview: 'Hello [Company Name] Team,\n\nWhen I discovered the [Job Title] opening at [Company Name], I knew this was the opportunity...'
    },
    {
      id: 'formal',
      name: 'Formal',
      description: 'Traditional and conservative approach',
      tone: 'formal',
      preview: 'Dear Sir/Madam,\n\nI am writing to formally apply for the position of [Job Title] at [Company Name]...'
    }
  ]

  res.json({
    success: true,
    templates
  })
})

// Get cover letter tips endpoint
router.get('/tips', (req, res) => {
  const tips = [
    {
      category: 'Structure',
      tips: [
        'Start with your contact information and the date',
        'Address the hiring manager by name if possible',
        'Keep it to one page maximum',
        'Use 3-4 paragraphs with clear structure'
      ]
    },
    {
      category: 'Content',
      tips: [
        'Customize each cover letter for the specific job',
        'Highlight your most relevant achievements',
        'Show knowledge about the company and role',
        'Explain why you want to work for this specific company'
      ]
    },
    {
      category: 'Writing Style',
      tips: [
        'Use active voice and strong action verbs',
        'Be specific with examples and numbers',
        'Match the tone to the company culture',
        'Proofread carefully for grammar and spelling'
      ]
    },
    {
      category: 'Common Mistakes',
      tips: [
        'Don\'t repeat everything from your resume',
        'Avoid generic, one-size-fits-all letters',
        'Don\'t focus only on what you want from the job',
        'Don\'t use overly casual language unless appropriate'
      ]
    }
  ]

  res.json({
    success: true,
    tips
  })
})

export default router