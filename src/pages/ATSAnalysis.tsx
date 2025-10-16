import React, { useState, useRef } from 'react'
import Sidebar from '../components/Sidebar'
import { Upload, FileText, Target, TrendingUp, AlertCircle, CheckCircle, XCircle, Loader2, Download } from 'lucide-react'
import { toast } from 'sonner'

interface ATSScore {
  overall: number
  sections: {
    formatting: number
    keywords: number
    experience: number
    education: number
    skills: number
  }
}

interface KeywordAnalysis {
  matched: string[]
  missing: string[]
  suggestions: string[]
}

interface ATSAnalysisResult {
  score: ATSScore
  keywords: KeywordAnalysis
  improvements: string[]
  strengths: string[]
  recommendations: string[]
}

const ATSAnalysis = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [analysisResult, setAnalysisResult] = useState<ATSAnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.includes('pdf') && !file.type.includes('doc')) {
      toast.error('Please upload a PDF or DOC file')
      return
    }

    setUploadedFile(file)
    toast.success('Resume uploaded successfully!')
  }

  const handleAnalyze = async () => {
    if (!uploadedFile) {
      toast.error('Please upload a resume first')
      return
    }

    if (!jobDescription.trim()) {
      toast.error('Please enter a job description')
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('resume', uploadedFile)
      formData.append('jobDescription', jobDescription)

      const response = await fetch('/api/ats/analyze', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to analyze resume')
      }

      const result = await response.json()
      setAnalysisResult(result.analysis)
      toast.success('ATS analysis completed!')
    } catch (error) {
      console.error('Error analyzing resume:', error)
      toast.error('Failed to analyze resume. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5 text-green-400" />
    if (score >= 60) return <AlertCircle className="w-5 h-5 text-yellow-400" />
    return <XCircle className="w-5 h-5 text-red-400" />
  }

  const downloadReport = () => {
    if (!analysisResult) return

    const reportContent = `
ATS Analysis Report
==================

Overall Score: ${analysisResult.score.overall}/100

Section Scores:
- Formatting: ${analysisResult.score.sections.formatting}/100
- Keywords: ${analysisResult.score.sections.keywords}/100
- Experience: ${analysisResult.score.sections.experience}/100
- Education: ${analysisResult.score.sections.education}/100
- Skills: ${analysisResult.score.sections.skills}/100

Matched Keywords:
${analysisResult.keywords.matched.map(keyword => `- ${keyword}`).join('\n')}

Missing Keywords:
${analysisResult.keywords.missing.map(keyword => `- ${keyword}`).join('\n')}

Improvements:
${analysisResult.improvements.map(improvement => `- ${improvement}`).join('\n')}

Strengths:
${analysisResult.strengths.map(strength => `- ${strength}`).join('\n')}

Recommendations:
${analysisResult.recommendations.map(rec => `- ${rec}`).join('\n')}
    `

    const blob = new Blob([reportContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ats-analysis-report.txt'
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    
    toast.success('Report downloaded successfully!')
  }

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white">ATS Analysis</h1>
            {analysisResult && (
              <button
                onClick={downloadReport}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Report
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Upload Section */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Upload Resume
              </h2>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-slate-500 transition-colors"
              >
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                {uploadedFile ? (
                  <div>
                    <p className="text-white font-medium">{uploadedFile.name}</p>
                    <p className="text-slate-400 text-sm">Click to change file</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-white font-medium mb-2">Upload your resume</p>
                    <p className="text-slate-400 text-sm">PDF or DOC files only</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Job Description Section */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-green-400" />
                Job Description
              </h2>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here to analyze keyword matching and ATS compatibility..."
                className="w-full h-40 bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAnalyze}
                disabled={isLoading || !uploadedFile || !jobDescription.trim()}
                className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-5 h-5" />
                    Analyze Resume
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Analysis Results */}
          {analysisResult && (
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h2 className="text-xl font-semibold text-white mb-4">Overall ATS Score</h2>
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-24">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-slate-700"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - analysisResult.score.overall / 100)}`}
                        className={getScoreColor(analysisResult.score.overall)}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-2xl font-bold ${getScoreColor(analysisResult.score.overall)}`}>
                        {analysisResult.score.overall}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold ${getScoreColor(analysisResult.score.overall)}`}>
                      {analysisResult.score.overall}/100
                    </h3>
                    <p className="text-slate-400">
                      {analysisResult.score.overall >= 80 ? 'Excellent ATS compatibility' :
                       analysisResult.score.overall >= 60 ? 'Good ATS compatibility' :
                       'Needs improvement for ATS'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section Scores */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h2 className="text-xl font-semibold text-white mb-4">Section Breakdown</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {Object.entries(analysisResult.score.sections).map(([section, score]) => (
                    <div key={section} className="bg-slate-700 rounded-lg p-4 text-center">
                      <div className="flex items-center justify-center mb-2">
                        {getScoreIcon(score)}
                      </div>
                      <h3 className="text-white font-medium capitalize mb-1">{section}</h3>
                      <p className={`text-lg font-bold ${getScoreColor(score)}`}>{score}/100</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Keywords Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Matched Keywords ({analysisResult.keywords.matched.length})
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.keywords.matched.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-900 text-green-300 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-400" />
                    Missing Keywords ({analysisResult.keywords.missing.length})
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.keywords.missing.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-red-900 text-red-300 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Improvements and Strengths */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    Areas for Improvement
                  </h2>
                  <ul className="space-y-3">
                    {analysisResult.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-slate-300">{improvement}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Strengths
                  </h2>
                  <ul className="space-y-3">
                    {analysisResult.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-slate-300">{strength}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  Recommendations
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysisResult.recommendations.map((recommendation, index) => (
                    <div key={index} className="bg-slate-700 rounded-lg p-4">
                      <p className="text-slate-300">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!analysisResult && !isLoading && (
            <div className="bg-slate-800 rounded-xl p-12 border border-slate-700 text-center">
              <Target className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Ready to Analyze Your Resume?</h3>
              <p className="text-slate-400 mb-6">
                Upload your resume and paste a job description to get detailed ATS compatibility analysis
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Keyword matching
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  ATS score calculation
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Improvement suggestions
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ATSAnalysis