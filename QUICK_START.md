# 🚀 CareerSync - Google OAuth Setup Guide

Your project is now on GitHub at: **https://github.com/mrkrisshu/careersync__**

## ✅ What's Ready

- ✅ Project pushed to GitHub
- ✅ Google OAuth authentication system implemented
- ✅ JWT token-based sessions
- ✅ All features set to FREE
- ✅ No Supabase required

## 🔐 Setup Google OAuth (3 Simple Steps)

### Step 1: Create Google OAuth Credentials

1. Go to **[Google Cloud Console](https://console.cloud.google.com)**
2. Click **"Select a Project"** → **"New Project"**
3. Name: `CareerSync` → **Create**
4. Wait for project creation
5. In the new project, go to **APIs & Services** → **Library**
6. Search for **"Google+ API"** → Click it → **Enable**

### Step 2: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **"+ Create Credentials"** → **OAuth client ID**
3. If prompted for OAuth consent screen:
   - Select **External** → **Create**
   - App name: `CareerSync`
   - User support email: Your email
   - Developer contact: Your email
   - **Save & Continue** → **Save & Continue** → **Back to Dashboard**

4. Click **+ Create Credentials** → **OAuth client ID** again
5. Application type: **Web application**
6. Name: `CareerSync Web`
7. Add **Authorized redirect URIs**:
   ```
   http://localhost:5173/auth/callback
   http://localhost:5173
   ```
8. Click **Create**
9. Copy **Client ID** and **Client Secret**

### Step 3: Add Credentials to Your Project

1. Open `.env` in your project:
   ```env
   VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
   GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
   GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
   ```

2. Replace `YOUR_CLIENT_ID_HERE` and `YOUR_CLIENT_SECRET_HERE` with actual values from Google Cloud

3. Save the file

## 🚀 Run the Project

```bash
cd c:\Users\mrkri\Desktop\CarrerSync
pnpm install
pnpm dev
```

Then open: **http://localhost:5173**

## 🧪 Test Google Login

1. Click **"Continue with Google"** on login page
2. Sign in with your Google account
3. You'll be redirected back and logged in!
4. All features are unlocked and **FREE**

## 📁 Project Structure

```
CareerSync/
├── src/
│   ├── pages/
│   │   ├── Login.tsx              # Login with Google
│   │   ├── Register.tsx           # Register with Google
│   │   ├── AuthCallback.tsx       # OAuth redirect handler
│   │   ├── Dashboard.tsx          # Main app
│   │   ├── ResumeBuilder.tsx      # Resume builder
│   │   ├── ATSAnalysis.tsx        # ATS score analysis
│   │   └── ...
│   ├── hooks/
│   │   └── useAuth.ts             # Google OAuth logic
│   └── App.tsx                    # Routes
├── api/
│   ├── routes/
│   │   └── auth.ts                # OAuth endpoint
│   └── server.ts                  # Backend
├── .env                           # Your credentials go here
├── README.md                      # Project info
└── GOOGLE_AUTH_SETUP.md          # Detailed setup
```

## 🔑 Key Features

✨ **Google OAuth Only** - No passwords needed
✨ **JWT Tokens** - Secure session management
✨ **Free Forever** - All features unlocked
✨ **AI-Powered** - Resume analysis, cover letters, ATS scores
✨ **Job Tracking** - Track applications and progress
✨ **Analytics** - Dashboard with insights

## 🌐 Production Deployment

When ready to deploy:

1. Add your production domain to Google OAuth:
   - `https://yourdomain.com/auth/callback`
   - `https://yourdomain.com`

2. Update `.env` for production:
   ```env
   FRONTEND_URL=https://yourdomain.com
   JWT_SECRET=your-secure-random-string
   ```

3. Deploy frontend to Vercel/Netlify
4. Deploy backend to Railway/Heroku/AWS

## 📝 Environment Variables Reference

```env
# Frontend OAuth
VITE_GOOGLE_CLIENT_ID=xxxx

# Backend OAuth
GOOGLE_CLIENT_ID=xxxx
GOOGLE_CLIENT_SECRET=xxxx
FRONTEND_URL=http://localhost:5173

# JWT Token
JWT_SECRET=change-this-in-production

# AI Features
GEMINI_API_KEY=xxxx

# Server
PORT=3001
```

## 🛠️ Troubleshooting

**Error: "Google Client ID not configured"**
- Make sure `VITE_GOOGLE_CLIENT_ID` is in `.env`
- Restart `pnpm dev`

**Error: "Failed to exchange code for token"**
- Check `GOOGLE_CLIENT_SECRET` is correct
- Verify redirect URI matches in Google Cloud

**Users not logging in**
- Check browser localStorage for `google_token`
- Check backend logs: `tail api/server.ts`

**CORS errors**
- Frontend should be http://localhost:5173
- Backend should be http://localhost:3001

## 📞 Need Help?

1. Check the setup guide: `GOOGLE_AUTH_SETUP.md`
2. View detailed auth docs: `AUTHENTICATION_SETUP.md`
3. Check browser console for errors
4. Check backend logs

## 🎉 You're All Set!

Your CareerSync app is ready with:
- ✅ Google OAuth authentication
- ✅ Free tier for all users
- ✅ Modern UI with animations
- ✅ AI-powered features
- ✅ Full job search toolkit

Happy coding! 🚀

---

**Repository**: https://github.com/mrkrisshu/careersync__
**Created**: October 2025
