# CareerSync

CareerSync is an intelligent career management platform that combines ATS analysis, resume optimization, job tracking, and AI-powered cover letter generation to help job seekers land their dream roles.

## Features

- **ATS Analysis**: Analyze your resume against job descriptions using AI
- **Resume Builder**: Create and optimize your resume with professional templates
- **Job Tracker**: Track your job applications and maintain a pipeline
- **Cover Letter Generator**: Generate personalized cover letters with AI
- **Analytics Dashboard**: Monitor your job search progress and metrics
- **Google OAuth Authentication**: Secure, passwordless authentication

## Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - High-quality component library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe backend code
- **Supabase** - PostgreSQL database + Auth
- **Google Gemini API** - AI capabilities

### Infrastructure
- **Supabase** - Database, authentication, and real-time features
- **Google Cloud** - OAuth 2.0 authentication
- **Vercel** - Frontend deployment (configured)

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- A Supabase account (https://supabase.com)
- Google Cloud Console credentials (for OAuth)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd CareerSync
```

2. Install dependencies:
```bash
pnpm install
```

3. Create `.env` file in the root directory:
```
VITE_SUPABASE_URL=https://fhlqcejpmbrftmejauxd.supabase.co
VITE_SUPABASE_KEY=your_supabase_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Backend
DATABASE_URL=your_supabase_connection_string
JWT_SECRET=your_jwt_secret_here
PORT=3001
```

### Running the Application

```bash
# Development mode (starts both frontend and backend)
pnpm dev

# Frontend only (port 5174)
pnpm dev:frontend

# Backend only (port 3001)
pnpm dev:backend
```

## Authentication Setup

CareerSync uses **Google OAuth 2.0** for authentication. To enable it:

### Step 1: Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Set Application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:5174/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)
7. Save your Client ID and Client Secret

### Step 2: Supabase Configuration
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Navigate to **Authentication → Providers → Google**
3. Toggle to enable Google provider
4. Paste your Google Client ID and Client Secret
5. Save changes

For detailed setup instructions, see [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)

## Project Structure

```
├── src/                    # Frontend React application
│   ├── components/        # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and configurations
│   ├── pages/            # Page components
│   └── assets/           # Images and static files
├── api/                   # Backend Express application
│   ├── config/           # Configuration modules
│   ├── middleware/       # Custom middleware
│   ├── routes/           # API endpoints
│   └── server.ts         # Server entry point
├── supabase/             # Database migrations
└── public/               # Static files
```

## API Endpoints

### Authentication
- `POST /api/auth/callback` - OAuth callback handler

### Resume Analysis
- `POST /api/resume/analyze` - Analyze resume with Gemini AI
- `POST /api/resume/upload` - Upload resume file

### ATS Analysis
- `POST /api/ats/analyze` - Compare resume against job description

### Job Tracking
- `GET /api/jobs` - Get all tracked jobs
- `POST /api/jobs` - Add new job
- `PUT /api/jobs/:id` - Update job status

### Cover Letters
- `POST /api/cover-letter/generate` - Generate cover letter with AI

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_KEY` | Supabase anonymous key |
| `VITE_GEMINI_API_KEY` | Google Gemini API key |
| `DATABASE_URL` | Supabase connection string |
| `JWT_SECRET` | Secret for JWT token signing |
| `PORT` | Backend server port (default: 3001) |

## Development

### Running Tests
```bash
pnpm test
```

### Building for Production
```bash
pnpm build
```

### Code Quality
```bash
pnpm lint
```

## Troubleshooting

### "Unsupported provider: provider is not enabled"
This error means Google OAuth is not enabled in your Supabase project. Follow the **Authentication Setup** section above to configure it.

### Database Connection Issues
Ensure your `DATABASE_URL` in `.env` is correct and your Supabase project is accessible.

### CORS Errors
Frontend and backend must be on the same origin or have proper CORS headers configured in `api/server.ts`.

## Deployment

### Frontend (Vercel)
```bash
pnpm build
# Vercel automatically deploys when you push to main
```

### Backend (Heroku, Railway, or similar)
1. Set environment variables on your hosting platform
2. Deploy the `api/` directory
3. Update your frontend's API base URL

## Contributing

Contributions are welcome! Please follow these steps:
1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit changes (`git commit -m 'Add AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:
- Open an issue on GitHub
- Check the [troubleshooting guide](./AUTHENTICATION_SETUP.md)
- See [setup documentation](./GOOGLE_OAUTH_SETUP.md)
