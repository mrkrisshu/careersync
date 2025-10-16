import express from 'express'
import multer from 'multer'
import pdfParse from 'pdf-parse'
import mammoth from 'mammoth'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { supabase } from '../config/supabase.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Configure multer for file uploads
const storage = multer.memoryStorage()
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/msword' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true)
    } else {
      cb(new Error('Only PDF and DOC files are allowed'))
    }
  }
})

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Parse uploaded resume
router.post('/parse', authenticateToken, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    let extractedText = ''

    // Extract text based on file type
    if (req.file.mimetype === 'application/pdf') {
      const pdfData = await pdfParse(req.file.buffer)
      extractedText = pdfData.text
    } else if (req.file.mimetype.includes('word') || req.file.mimetype.includes('document')) {
      const result = await mammoth.extractRawText({ buffer: req.file.buffer })
      extractedText = result.value
    }

    // Use Gemini AI to parse the resume text into structured data
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    const prompt = `
    Parse the following resume text and extract structured information. Return a JSON object with the following structure:
    {
      "personalInfo": {
        "name": "",
        "email": "",
        "phone": "",
        "location": "",
        "linkedin": "",
        "portfolio": ""
      },
      "summary": "",
      "experience": [
        {
          "id": "unique_id",
          "company": "",
          "position": "",
          "duration": "",
          "description": ""
        }
      ],
      "education": [
        {
          "id": "unique_id",
          "institution": "",
          "degree": "",
          "duration": "",
          "gpa": ""
        }
      ],
      "skills": ["skill1", "skill2"],
      "projects": [
        {
          "id": "unique_id",
          "name": "",
          "description": "",
          "technologies": "",
          "link": ""
        }
      ]
    }

    Resume text:
    ${extractedText}

    Please extract all available information and structure it properly. Generate unique IDs for each experience, education, and project entry.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Clean the response to extract JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Failed to parse resume structure')
    }

    const resumeData = JSON.parse(jsonMatch[0])

    res.json({ 
      success: true, 
      resumeData,
      message: 'Resume parsed successfully' 
    })

  } catch (error) {
    console.error('Error parsing resume:', error)
    res.status(500).json({ 
      error: 'Failed to parse resume',
      details: error.message 
    })
  }
})

// Tailor resume using AI
router.post('/tailor', authenticateToken, async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body

    if (!resumeData || !jobDescription) {
      return res.status(400).json({ error: 'Resume data and job description are required' })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    const prompt = `
    You are an expert resume writer. Tailor the following resume to match the job description provided. 
    Focus on:
    1. Optimizing the professional summary to align with the job requirements
    2. Highlighting relevant experience and achievements
    3. Emphasizing matching skills
    4. Adjusting project descriptions to show relevant experience
    5. Using keywords from the job description naturally

    Current Resume Data:
    ${JSON.stringify(resumeData, null, 2)}

    Job Description:
    ${jobDescription}

    Return the tailored resume in the same JSON structure as the input, but with optimized content that better matches the job requirements. Keep all the original structure and IDs intact.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Clean the response to extract JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Failed to tailor resume')
    }

    const tailoredResumeData = JSON.parse(jsonMatch[0])

    res.json({ 
      success: true, 
      resumeData: tailoredResumeData,
      message: 'Resume tailored successfully' 
    })

  } catch (error) {
    console.error('Error tailoring resume:', error)
    res.status(500).json({ 
      error: 'Failed to tailor resume',
      details: error.message 
    })
  }
})

// Save resume to database
router.post('/save', authenticateToken, async (req, res) => {
  try {
    const { resumeData } = req.body
    const userId = req.user.id

    if (!resumeData) {
      return res.status(400).json({ error: 'Resume data is required' })
    }

    // Check if user already has a resume
    const { data: existingResume } = await supabase
      .from('resumes')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (existingResume) {
      // Update existing resume
      const { error } = await supabase
        .from('resumes')
        .update({
          content: resumeData,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)

      if (error) throw error
    } else {
      // Create new resume
      const { error } = await supabase
        .from('resumes')
        .insert({
          user_id: userId,
          title: `${resumeData.personalInfo?.name || 'My'} Resume`,
          content: resumeData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (error) throw error
    }

    res.json({ 
      success: true, 
      message: 'Resume saved successfully' 
    })

  } catch (error) {
    console.error('Error saving resume:', error)
    res.status(500).json({ 
      error: 'Failed to save resume',
      details: error.message 
    })
  }
})

// Get user's resume
router.get('/get', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id

    const { data: resume, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    res.json({ 
      success: true, 
      resume: resume || null
    })

  } catch (error) {
    console.error('Error fetching resume:', error)
    res.status(500).json({ 
      error: 'Failed to fetch resume',
      details: error.message 
    })
  }
})

// Download resume as PDF
router.post('/download', authenticateToken, async (req, res) => {
  try {
    const { resumeData } = req.body

    if (!resumeData) {
      return res.status(400).json({ error: 'Resume data is required' })
    }

    // Generate HTML content for PDF
    const htmlContent = generateResumeHTML(resumeData)

    // For now, we'll return the HTML content
    // In a production environment, you would use a library like puppeteer to generate PDF
    res.setHeader('Content-Type', 'text/html')
    res.setHeader('Content-Disposition', `attachment; filename="${resumeData.personalInfo?.name || 'resume'}.html"`)
    res.send(htmlContent)

  } catch (error) {
    console.error('Error generating resume download:', error)
    res.status(500).json({ 
      error: 'Failed to generate resume download',
      details: error.message 
    })
  }
})

// Helper function to generate HTML for resume
function generateResumeHTML(resumeData) {
  const { personalInfo, summary, experience, education, skills, projects } = resumeData

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${personalInfo?.name || 'Resume'}</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .name { font-size: 2.5em; font-weight: bold; margin-bottom: 10px; }
            .contact { color: #666; }
            .section { margin-bottom: 25px; }
            .section-title { font-size: 1.3em; font-weight: bold; border-bottom: 2px solid #333; padding-bottom: 5px; margin-bottom: 15px; }
            .experience-item, .education-item, .project-item { margin-bottom: 20px; }
            .item-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px; }
            .item-title { font-weight: bold; }
            .item-duration { color: #666; font-size: 0.9em; }
            .item-company { color: #555; font-weight: 500; margin-bottom: 8px; }
            .skills { display: flex; flex-wrap: wrap; gap: 8px; }
            .skill { background: #f0f0f0; padding: 4px 12px; border-radius: 20px; font-size: 0.9em; }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="name">${personalInfo?.name || 'Your Name'}</div>
            <div class="contact">
                ${personalInfo?.email ? `<div>${personalInfo.email}</div>` : ''}
                ${personalInfo?.phone ? `<div>${personalInfo.phone}</div>` : ''}
                ${personalInfo?.location ? `<div>${personalInfo.location}</div>` : ''}
                ${personalInfo?.linkedin ? `<div>${personalInfo.linkedin}</div>` : ''}
                ${personalInfo?.portfolio ? `<div>${personalInfo.portfolio}</div>` : ''}
            </div>
        </div>

        ${summary ? `
        <div class="section">
            <div class="section-title">Professional Summary</div>
            <p>${summary}</p>
        </div>
        ` : ''}

        ${experience?.length > 0 ? `
        <div class="section">
            <div class="section-title">Work Experience</div>
            ${experience.map(exp => `
                <div class="experience-item">
                    <div class="item-header">
                        <div class="item-title">${exp.position}</div>
                        <div class="item-duration">${exp.duration}</div>
                    </div>
                    <div class="item-company">${exp.company}</div>
                    <p>${exp.description}</p>
                </div>
            `).join('')}
        </div>
        ` : ''}

        ${education?.length > 0 ? `
        <div class="section">
            <div class="section-title">Education</div>
            ${education.map(edu => `
                <div class="education-item">
                    <div class="item-header">
                        <div class="item-title">${edu.degree}</div>
                        <div class="item-duration">${edu.duration}</div>
                    </div>
                    <div class="item-company">${edu.institution}</div>
                    ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}

        ${skills?.length > 0 ? `
        <div class="section">
            <div class="section-title">Skills</div>
            <div class="skills">
                ${skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
            </div>
        </div>
        ` : ''}

        ${projects?.length > 0 ? `
        <div class="section">
            <div class="section-title">Projects</div>
            ${projects.map(project => `
                <div class="project-item">
                    <div class="item-header">
                        <div class="item-title">${project.name}</div>
                        ${project.link ? `<a href="${project.link}">View Project</a>` : ''}
                    </div>
                    <div class="item-company">${project.technologies}</div>
                    <p>${project.description}</p>
                </div>
            `).join('')}
        </div>
        ` : ''}
    </body>
    </html>
  `
}

export default router