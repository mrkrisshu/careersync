-- CareerSync Database Schema
-- Create all tables with proper indexes and RLS policies

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    api_key_encrypted TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- Set up RLS policies for users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Create resumes table
CREATE TABLE resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    resume_text TEXT NOT NULL,
    ats_score INTEGER DEFAULT 0 CHECK (ats_score >= 0 AND ats_score <= 100),
    analysis JSONB,
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for resumes
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_resumes_ats_score ON resumes(ats_score DESC);
CREATE INDEX idx_resumes_created_at ON resumes(created_at DESC);

-- Set up RLS policies for resumes
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own resumes" ON resumes FOR ALL USING (auth.uid() = user_id);

-- Create jobs table
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    jd_text TEXT NOT NULL,
    company VARCHAR(200) NOT NULL,
    title VARCHAR(200) NOT NULL,
    job_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for jobs
CREATE INDEX idx_jobs_user_id ON jobs(user_id);
CREATE INDEX idx_jobs_company ON jobs(company);
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);

-- Set up RLS policies for jobs
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own jobs" ON jobs FOR ALL USING (auth.uid() = user_id);

-- Create applications table
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'applied' CHECK (status IN ('applied', 'interviewing', 'offer', 'rejected')),
    ats_score INTEGER DEFAULT 0 CHECK (ats_score >= 0 AND ats_score <= 100),
    notes TEXT,
    applied_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for applications
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_applied_date ON applications(applied_date DESC);
CREATE INDEX idx_applications_ats_score ON applications(ats_score DESC);

-- Set up RLS policies for applications
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own applications" ON applications FOR ALL USING (auth.uid() = user_id);

-- Create improvements table
CREATE TABLE improvements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
    suggestion TEXT NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    applied BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for improvements
CREATE INDEX idx_improvements_resume_id ON improvements(resume_id);
CREATE INDEX idx_improvements_applied ON improvements(applied);
CREATE INDEX idx_improvements_created_at ON improvements(created_at DESC);

-- Set up RLS policies for improvements
ALTER TABLE improvements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view improvements for own resumes" ON improvements FOR SELECT 
USING (EXISTS (SELECT 1 FROM resumes WHERE resumes.id = improvements.resume_id AND resumes.user_id = auth.uid()));

-- Create skills_missing table
CREATE TABLE skills_missing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
    skill VARCHAR(200) NOT NULL,
    course_link TEXT,
    platform VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for skills_missing
CREATE INDEX idx_skills_missing_resume_id ON skills_missing(resume_id);
CREATE INDEX idx_skills_missing_skill ON skills_missing(skill);
CREATE INDEX idx_skills_missing_platform ON skills_missing(platform);

-- Set up RLS policies for skills_missing
ALTER TABLE skills_missing ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view missing skills for own resumes" ON skills_missing FOR SELECT 
USING (EXISTS (SELECT 1 FROM resumes WHERE resumes.id = skills_missing.resume_id AND resumes.user_id = auth.uid()));

-- Grant permissions to anon and authenticated roles
GRANT SELECT ON users TO anon;
GRANT ALL PRIVILEGES ON users TO authenticated;

GRANT SELECT ON resumes TO anon;
GRANT ALL PRIVILEGES ON resumes TO authenticated;

GRANT SELECT ON jobs TO anon;
GRANT ALL PRIVILEGES ON jobs TO authenticated;

GRANT SELECT ON applications TO anon;
GRANT ALL PRIVILEGES ON applications TO authenticated;

GRANT SELECT ON improvements TO anon;
GRANT ALL PRIVILEGES ON improvements TO authenticated;

GRANT SELECT ON skills_missing TO anon;
GRANT ALL PRIVILEGES ON skills_missing TO authenticated;