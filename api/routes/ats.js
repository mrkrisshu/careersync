import express from 'express'
import multer from 'multer'
import { GoogleGenerativeAI } from '@google/generative-ai'
import pdfParse from 'pdf-parse'
import mammoth from 'mammoth'

const router = express.Router()

// Configure multer for file uploads
const storage = multer.memoryStorage()
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes('pdf') || file.mimetype.includes('document')) {
      cb(null, true)
    } else {
      cb(new Error('Only PDF and DOC files are allowed'), false)
    }
  }
})

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Extract text from uploaded file
const extractTextFromFile = async (file) => {
  try {
    if (file.mimetype.includes('pdf')) {
      const data = await pdfParse(file.buffer)
      return data.text
    } else if (file.mimetype.includes('document')) {
      const result = await mammoth.extractRawText({ buffer: file.buffer })
      return result.value
    }
    throw new Error('Unsupported file type')
  } catch (error) {
    console.error('Error extracting text from file:', error)
    throw new Error('Failed to extract text from file')
  }
}

// Calculate ATS score using AI analysis
const calculateATSScore = async (resumeText, jobDescription) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    const prompt = `
    Analyze this resume against the job description for ATS (Applicant Tracking System) compatibility.
    
    Resume:
    ${resumeText}
    
    Job Description:
    ${jobDescription}
    
    Please provide a detailed analysis in the following JSON format:
    {
      "score": {
        "overall": <number 0-100>,
        "sections": {
          "formatting": <number 0-100>,
          "keywords": <number 0-100>,
          "experience": <number 0-100>,
          "education": <number 0-100>,
          "skills": <number 0-100>
        }
      },
      "keywords": {
        "matched": ["keyword1", "keyword2"],
        "missing": ["missing1", "missing2"],
        "suggestions": ["suggestion1", "suggestion2"]
      },
      "improvements": [
        "Specific improvement suggestion 1",
        "Specific improvement suggestion 2"
      ],
      "strengths": [
        "Strength 1 found in resume",
        "Strength 2 found in resume"
      ],
      "recommendations": [
        "Actionable recommendation 1",
        "Actionable recommendation 2"
      ]
    }
    
    Analysis criteria:
    1. Formatting: Check for ATS-friendly formatting (no tables, images, complex layouts)
    2. Keywords: Match job description keywords with resume content
    3. Experience: Relevance of work experience to job requirements
    4. Education: Educational background alignment
    5. Skills: Technical and soft skills matching
    
    Provide specific, actionable feedback. Be thorough in keyword analysis.
    Return only valid JSON without any additional text.
    `
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Clean and parse JSON response
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim()
    return JSON.parse(cleanedText)
  } catch (error) {
    console.error('Error calculating ATS score:', error)
    throw new Error('Failed to analyze resume with AI')
  }
}

// ATS Analysis endpoint
router.post('/analyze', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded' })
    }

    if (!req.body.jobDescription) {
      return res.status(400).json({ error: 'Job description is required' })
    }

    // Extract text from uploaded resume
    const resumeText = await extractTextFromFile(req.file)
    
    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ error: 'Could not extract text from resume' })
    }

    // Analyze resume with AI
    const analysis = await calculateATSScore(resumeText, req.body.jobDescription)

    res.json({
      success: true,
      analysis,
      message: 'ATS analysis completed successfully'
    })
  } catch (error) {
    console.error('ATS analysis error:', error)
    res.status(500).json({ 
      error: 'Failed to analyze resume',
      message: error.message 
    })
  }
})

// Get ATS tips endpoint
router.get('/tips', (req, res) => {
  const tips = [
    {
      category: 'Formatting',
      tips: [
        'Use standard fonts like Arial, Calibri, or Times New Roman',
        'Avoid tables, text boxes, and complex layouts',
        'Use standard section headings like "Experience", "Education", "Skills"',
        'Save as PDF to preserve formatting'
      ]
    },
    {
      category: 'Keywords',
      tips: [
        'Include exact keywords from the job description',
        'Use both acronyms and full forms (e.g., "AI" and "Artificial Intelligence")',
        'Include industry-specific terminology',
        'Match the language used in the job posting'
      ]
    },
    {
      category: 'Content',
      tips: [
        'Quantify achievements with numbers and percentages',
        'Use action verbs to start bullet points',
        'Include relevant certifications and licenses',
        'Tailor content to match job requirements'
      ]
    },
    {
      category: 'Structure',
      tips: [
        'Start with contact information at the top',
        'Include a professional summary or objective',
        'List experience in reverse chronological order',
        'Keep resume to 1-2 pages maximum'
      ]
    }
  ]

  res.json({
    success: true,
    tips
  })
})

export default router