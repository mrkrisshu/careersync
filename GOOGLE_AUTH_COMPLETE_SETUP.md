# ✅ Complete Google OAuth Setup Guide for CareerSync

Your CareerSync app is ready for **Google Authentication Only** (no Supabase needed)!

Follow these steps to enable Google Sign-In:

---

## 📋 Step 1: Create Google Cloud Project

1. Go to **[Google Cloud Console](https://console.cloud.google.com)**
2. Click **"Select a Project"** at the top
3. Click **"NEW PROJECT"**
4. Enter name: `CareerSync`
5. Click **"CREATE"**
6. Wait for the project to be created (1-2 minutes)

---

## 🔑 Step 2: Enable Google+ API

1. In Google Cloud Console, search for **"Google+ API"** in the search bar
2. Click on **"Google+ API"** from results
3. Click **"ENABLE"**
4. Wait for it to enable (about 30 seconds)

---

## 🎯 Step 3: Create OAuth 2.0 Credentials

### Part A: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth Consent Screen** (left sidebar)
2. Select **External** as the user type
3. Click **"CREATE"**
4. Fill in the form:
   - **App name**: CareerSync
   - **User support email**: your@email.com
   - **Developer contact information**: your@email.com
5. Click **"SAVE AND CONTINUE"**
6. On **Scopes** page, click **"SAVE AND CONTINUE"**
7. On **Summary** page, click **"BACK TO DASHBOARD"**

### Part B: Create Web Application Credentials

1. Go to **APIs & Services** → **Credentials** (left sidebar)
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. Select application type: **"Web application"**
4. Enter name: `CareerSync Web`
5. Under **Authorized redirect URIs**, add these URLs:
   ```
   http://localhost:5173/auth/callback
   http://localhost:5173
   ```
6. Click **"CREATE"**
7. A popup will show your credentials - **COPY THESE:**
   - ✅ **Client ID** (looks like: `xxxx.apps.googleusercontent.com`)
   - ✅ **Client Secret** (looks like: `GOCSP...`)

---

## 🔧 Step 4: Add Credentials to Your Project

### Update `.env` file

1. Open `.env` in the project root
2. Find these lines and replace with YOUR credentials:

```env
# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET_HERE
FRONTEND_URL=http://localhost:5173
```

**Example:**
```env
VITE_GOOGLE_CLIENT_ID=123456789.apps.googleusercontent.com
GOOGLE_CLIENT_ID=123456789.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSP-xxxxxxxxxxxxx
FRONTEND_URL=http://localhost:5173
```

---

## 🚀 Step 5: Start Your Application

```bash
pnpm dev
```

You should see:
```
✓ Frontend ready at http://localhost:5173/
✓ Backend ready on port 3001
```

---

## ✨ Step 6: Test Google Sign-In

1. Open **http://localhost:5173** in your browser
2. Click **"Continue with Google"** button on Login page
3. You'll be redirected to Google Sign-In
4. Sign in with your Google account
5. You'll be redirected back to dashboard ✅

---

## 📁 How the Google Auth Works

### Frontend Flow:
```
Login Page 
  ↓ (Click "Continue with Google")
Google OAuth Consent Screen
  ↓ (User signs in)
Browser redirected to: http://localhost:5173/auth/callback?code=XXXXX
  ↓
AuthCallback.tsx component
  ↓ (Sends code to backend)
Backend exchanges code for user info
  ↓ (Receives JWT token)
Token stored in localStorage
  ↓ (Redirect to dashboard)
User logged in ✅
```

### Key Files:
- **`src/hooks/useAuth.ts`** - Google OAuth logic
- **`src/pages/AuthCallback.tsx`** - Handles Google redirect
- **`src/pages/Login.tsx`** - Login page with Google button
- **`api/routes/auth.ts`** - Backend token exchange endpoint

---

## 🔐 User Session Details

### What's Stored:
- JWT token in browser localStorage
- User info: ID, email, name, profile picture
- Token expires in 7 days

### User stays logged in until:
- ❌ They click "Sign Out"
- ❌ Token expires (7 days)
- ❌ They clear browser localStorage
- ❌ Browser cookies are cleared

---

## 🌐 Deployment to Production

When deploying to production:

### 1. Update Google Cloud Console:
1. Go to **APIs & Services** → **Credentials**
2. Click your OAuth 2.0 credential
3. Add your production domain to **Authorized redirect URIs**:
   ```
   https://yourdomain.com/auth/callback
   https://yourdomain.com
   ```
4. Click **"SAVE"**

### 2. Update Environment Variables:
On your hosting platform (Vercel, Railway, etc.), set:

```env
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET
FRONTEND_URL=https://yourdomain.com
JWT_SECRET=your-random-secret-key-change-this
```

### 3. Deploy:
```bash
git push origin main
# Your deployment platform will automatically deploy
```

---

## ❌ Troubleshooting

| Problem | Solution |
|---------|----------|
| "Google Client ID not configured" | Check `.env` - make sure `VITE_GOOGLE_CLIENT_ID` is set |
| "Failed to exchange code for token" | Verify `GOOGLE_CLIENT_SECRET` is correct in `.env` |
| Redirect loop | Make sure redirect URI in Google Cloud matches exactly |
| "Invalid client" error | Check that Client ID and Secret are correct |
| Not staying logged in | Check browser DevTools → Application → LocalStorage for `google_token` |
| CORS errors | Ensure both frontend (5173) and backend (3001) are running |

---

## 📚 Additional Customization

### Change Token Expiration:
Edit `api/routes/auth.ts` line 57:
```typescript
{ expiresIn: '7d' }  // Change to '30d', '24h', etc.
```

### Access User Info in Components:
```typescript
import { useAuth } from '../hooks/useAuth'

export function MyComponent() {
  const { user } = useAuth()
  
  return (
    <div>
      <p>Welcome, {user?.name}</p>
      <img src={user?.picture} alt="Profile" />
      <p>Email: {user?.email}</p>
    </div>
  )
}
```

---

## 🎉 You're Done!

Your CareerSync app now has **Google OAuth authentication**! 

**Next Steps:**
- ✅ Test login/logout functionality
- ✅ Add user profile page
- ✅ Store user data in database
- ✅ Deploy to production

---

## 📞 Need Help?

Common issues:
1. **Port already in use?** → `taskkill /F /IM node.exe` then restart
2. **Changes not showing?** → Clear browser cache (Ctrl+Shift+Delete)
3. **Token not saving?** → Check browser DevTools Console for errors
4. **Backend errors?** → Check server logs in terminal

---

**Happy coding! 🚀**

Repository: https://github.com/mrkrisshu/careersync
