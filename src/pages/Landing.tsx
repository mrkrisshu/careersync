import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { 
  FileText, 
  Target, 
  Mail, 
  BarChart3, 
  Zap, 
  Shield, 
  CheckCircle, 
  ArrowRight,
  Star,
  Users,
  TrendingUp,
  Phone,
  MapPin,
  Clock,
  Award,
  Brain,
  Sparkles,
  IndianRupee
} from 'lucide-react'
import { HeroSection } from '../components/hero-odyssey'

const Landing = () => {
  const featuresRef = useRef<HTMLElement>(null)
  const pricingRef = useRef<HTMLElement>(null)
  const aboutRef = useRef<HTMLElement>(null)
  const contactRef = useRef<HTMLElement>(null)

  const scrollToSection = (sectionId: string) => {
    const refs = {
      features: featuresRef,
      pricing: pricingRef,
      about: aboutRef,
      contact: contactRef
    }
    
    const targetRef = refs[sectionId as keyof typeof refs]
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  const features = [
    {
      icon: <FileText className="w-8 h-8 text-blue-400" />,
      title: "AI Resume Tailoring",
      description: "Automatically optimize your resume for specific job descriptions using advanced AI analysis."
    },
    {
      icon: <Target className="w-8 h-8 text-blue-400" />,
      title: "ATS Score Analysis",
      description: "Get detailed ATS compatibility scores and actionable improvement suggestions."
    },
    {
      icon: <Mail className="w-8 h-8 text-blue-400" />,
      title: "Cover Letter Generator",
      description: "Generate personalized cover letters with different tones and styles."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-blue-400" />,
      title: "Job Application Tracking",
      description: "Track your applications, interviews, and career progress in one place."
    }
  ]

  const benefits = [
    "AI-Powered optimization using Google Gemini",
    "ATS-friendly resume analysis",
    "Secure data encryption",
    "Real-time application tracking",
    "Comprehensive analytics dashboard",
    "Skill gap analysis & course recommendations"
  ]

  const stats = [
    { number: "10K+", label: "Resumes Optimized" },
    { number: "95%", label: "ATS Pass Rate" },
    { number: "500+", label: "Job Placements" },
    { number: "4.9/5", label: "User Rating" }
  ]

  const pricingFeatures = [
    "AI Resume Tailoring for any job description",
    "ATS Score Analysis & Improvement Suggestions", 
    "Cover Letter Generator (3 tones: Formal, Friendly, Confident)",
    "Job Application Tracker with status management",
    "Analytics Dashboard with progress insights",
    "Skill Gap Analysis & Course Recommendations",
    "Achievement Quantifier with metrics",
    "Unlimited resume optimizations",
    "Secure API key storage (you provide Gemini key)",
    "Zero AI costs for CareerSync users",
    "24/7 customer support",
    "Regular feature updates"
  ]

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section - Using the new HeroSection component */}
      <HeroSection onNavigateToSection={scrollToSection} />

      {/* Stats Section */}
      <section className="py-16 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">{stat.number}</div>
                <div className="text-slate-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} id="features" className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need to Land Your Dream Job
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Our comprehensive suite of AI-powered tools helps you optimize every aspect of your job search.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-slate-800 p-8 rounded-2xl shadow-sm hover:shadow-lg hover:bg-slate-700 transition-all">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} id="about" className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                About CareerSync
              </h2>
              <p className="text-xl text-slate-300 mb-6">
                CareerSync is an AI-powered career optimization platform designed to help job seekers align their careers with every opportunity.
              </p>
              <p className="text-slate-300 mb-8">
                Built on a zero-cost SaaS model, we provide professional-grade tools without the premium price tag. Our platform leverages Google's Gemini AI to deliver personalized resume tailoring, comprehensive ATS analysis, and intelligent career insights.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <Brain className="w-6 h-6 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold mb-2">AI-Powered Intelligence</h4>
                    <p className="text-slate-300 text-sm">Advanced algorithms analyze job descriptions and optimize your resume for maximum impact.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Shield className="w-6 h-6 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold mb-2">Secure & Private</h4>
                    <p className="text-slate-300 text-sm">Your data is encrypted and secure. We never share your information with third parties.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Sparkles className="w-6 h-6 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold mb-2">Zero Hidden Costs</h4>
                    <p className="text-slate-300 text-sm">Transparent pricing with no surprise fees. You control your AI costs with your own API key.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Award className="w-6 h-6 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold mb-2">Proven Results</h4>
                    <p className="text-slate-300 text-sm">Join thousands of successful job seekers who have transformed their careers with CareerSync.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 p-8 rounded-2xl border border-slate-600">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
                <p className="text-slate-300 mb-6">
                  "Align your career with every opportunity" - We believe everyone deserves access to professional career optimization tools, regardless of their budget.
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  </div>
                  <span className="text-slate-300">Trusted by thousands</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section ref={pricingRef} id="pricing" className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Professional career optimization tools at an affordable price. No hidden fees, no surprises.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-3xl p-8 border border-slate-600">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">Free Tier</h3>
                <div className="flex items-center justify-center mb-4">
                  <span className="text-5xl font-bold text-white">₹0</span>
                  <span className="text-slate-300 ml-2">/month</span>
                </div>
                <p className="text-slate-300">Perfect for trying out CareerSync</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-200 text-sm">5 AI prompts per month</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-200 text-sm">Basic resume analysis</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-200 text-sm">ATS score checking</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-200 text-sm">Job application tracking</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-200 text-sm">Basic analytics dashboard</span>
                </div>
              </div>

              <div className="text-center">
                <Link
                  to="/register"
                  className="w-full bg-slate-600 hover:bg-slate-500 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors flex items-center justify-center mb-4"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <p className="text-xs text-slate-400">
                  No credit card required
                </p>
              </div>
            </div>

            {/* Pro Tier */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-3xl p-8 border-2 border-blue-500 relative overflow-hidden">
              {/* Popular badge */}
              <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-2 rounded-bl-2xl text-sm font-semibold">
                Most Popular
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">CareerSync Pro</h3>
                <div className="flex items-center justify-center mb-4">
                  <IndianRupee className="w-8 h-8 text-blue-400" />
                  <span className="text-5xl font-bold text-white">299</span>
                  <span className="text-slate-300 ml-2">/month</span>
                </div>
                <p className="text-slate-300">Everything you need to optimize your career</p>
              </div>

              <div className="space-y-4 mb-8">
                {pricingFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-200 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Link
                  to="/register"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors flex items-center justify-center mb-4"
                >
                  Upgrade to Pro
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <p className="text-xs text-slate-400">
                  * You provide your own Gemini API key - Zero AI costs for CareerSync
                </p>
              </div>
            </div>
          </div>


        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} id="contact" className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Have questions? Need support? We're here to help you succeed in your career journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Support */}
            <div className="bg-slate-700 p-8 rounded-2xl text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Email Support</h3>
              <p className="text-slate-300 mb-4">Get help with your account, features, or technical issues.</p>
              <a 
                href="mailto:support@careersync.com" 
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                support@careersync.com
              </a>
            </div>

            {/* Business */}
            <div className="bg-slate-700 p-8 rounded-2xl text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Business Inquiries</h3>
              <p className="text-slate-300 mb-4">Partnerships, enterprise solutions, and business opportunities.</p>
              <a 
                href="mailto:business@careersync.com" 
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                business@careersync.com
              </a>
            </div>

            {/* Response Time */}
            <div className="bg-slate-700 p-8 rounded-2xl text-center md:col-span-2 lg:col-span-1">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Response Time</h3>
              <p className="text-slate-300 mb-4">We typically respond within 24 hours during business days.</p>
              <span className="text-blue-400 font-semibold">&lt; 24 hours</span>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-16 bg-slate-700 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Frequently Asked Questions</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-semibold mb-2">How does the Gemini API key work?</h4>
                <p className="text-slate-300 text-sm">You provide your own Google Gemini API key, which we store securely and use for AI processing. This keeps your costs transparent and under your control.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Is my data secure?</h4>
                <p className="text-slate-300 text-sm">Yes, all data is encrypted and stored securely. We never share your personal information or resume data with third parties.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Can I cancel anytime?</h4>
                <p className="text-slate-300 text-sm">Absolutely! You can cancel your subscription at any time. No long-term contracts or cancellation fees.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Do you offer refunds?</h4>
                <p className="text-slate-300 text-sm">We offer a 7-day money-back guarantee. If you're not satisfied, contact us for a full refund.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Why Choose CareerSync?
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Built for job seekers who want professional results without the premium price tag.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-slate-200">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 p-8 rounded-2xl border border-slate-600">
              <div className="text-center">
                <Shield className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">Secure &amp; Private</h3>
                <p className="text-slate-300 mb-6">
                  Your data is encrypted and secure. We never share your information with third parties.
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  </div>
                  <span className="text-slate-300">Trusted by thousands</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of successful job seekers who have optimized their career journey with CareerSync.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center"
            >
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold">CareerSync</span>
              </div>
              <p className="text-slate-400">
                Align your career with every opportunity using AI-powered tools.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-slate-400">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Resume Tailor</button></li>
                <li><button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">ATS Analysis</button></li>
                <li><button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Cover Letters</button></li>
                <li><button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Job Tracker</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400">
                <li><button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors">About</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="hover:text-white transition-colors">Pricing</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-white transition-colors">Contact</button></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-white transition-colors">Help Center</button></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 CareerSync. All rights reserved.</p>
            <p className="mt-2">Developed with ❤️ by Krishna</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing