# Google OAuth Only - Setup Guide

Your CareerSync application now uses **Google OAuth only** - no Supabase authentication needed!

## Quick Setup Steps

### 1. Get Your Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project named "CareerSync"
3. Enable the **Google+ API**
4. Go to **APIs & Services** → **Credentials**
5. Create an **OAuth 2.0 Web Application** credential with these redirect URIs:
   - `http://localhost:5173/auth/callback`
   - `http://localhost:5173`
6. Copy the **Client ID** and **Client Secret**

### 2. Update Environment Variables

Edit your `.env` file and replace:

```env
VITE_GOOGLE_CLIENT_ID=YOUR_ACTUAL_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_ID=YOUR_ACTUAL_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_ACTUAL_GOOGLE_CLIENT_SECRET
```

### 3. Start the Application

```bash
pnpm dev
```

### 4. Test Google Login

1. Open http://localhost:5173
2. Click **"Continue with Google"**
3. You'll be redirected to Google to sign in
4. After signing in, you'll be redirected back and logged in!

## How It Works

### Authentication Flow

```
1. User clicks "Continue with Google" on Login/Register page
2. User is redirected to Google's OAuth consent screen
3. User signs in with their Google account
4. Google redirects back to your app with authorization code
5. Backend exchanges code for user info
6. JWT token is created and stored in localStorage
7. User is logged in and redirected to dashboard
```

### Key Files

- **`src/hooks/useAuth.ts`** - Google OAuth logic and token management
- **`src/pages/AuthCallback.tsx`** - Handles OAuth redirect from Google
- **`src/pages/Login.tsx`** - Login page with Google button
- **`src/pages/Register.tsx`** - Register page with Google button
- **`api/routes/auth.ts`** - Backend endpoint to exchange code for token
- **`.env`** - Configuration (add your Google credentials here)

### What's Stored

- JWT token in localStorage (automatically expires after 7 days)
- User info: ID, email, name, profile picture

### User Session

- Users stay logged in until:
  - They click "Sign Out"
  - Token expires (7 days)
  - They clear browser localStorage
  - Browser cookies are cleared

## Features

✅ No password management needed
✅ No Supabase required
✅ Simple Google sign-in
✅ JWT-based sessions
✅ Secure token storage
✅ Automatic token validation
✅ Works on localhost and production

## Production Deployment

When deploying to production:

1. Add your production domain to Google OAuth redirect URIs:
   - `https://yourdomain.com/auth/callback`
   - `https://yourdomain.com`

2. Update environment variables on your hosting:
   - Set `FRONTEND_URL` to your production domain
   - Update `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
   - Change `JWT_SECRET` to a secure random string

3. Deploy both frontend and backend

## Troubleshooting

### "Google Client ID not configured"

Make sure `VITE_GOOGLE_CLIENT_ID` is set in your `.env` file.

### "Failed to exchange code for token"

Check that `GOOGLE_CLIENT_SECRET` is correct and `FRONTEND_URL` matches your actual domain.

### User not staying logged in

Check browser DevTools → Application → LocalStorage for `google_token` key.

### CORS errors

Make sure your backend is running on `http://localhost:3001` and frontend on `http://localhost:5173`.

## Customization

### Change Token Expiration

Edit `src/hooks/useAuth.ts` line 57:
```typescript
{ expiresIn: '7d' }  // Change this to '30d', '24h', etc.
```

### Store User Info

The user object contains:
```typescript
{
  id: string
  email: string
  name: string
  picture: string
  iat: number
  exp: number
}
```

Access it in any component:
```typescript
const { user } = useAuth()
console.log(user?.email)
```

## Need Help?

If you encounter issues:

1. Check that Node.js is running both servers (frontend & backend)
2. Verify Google OAuth credentials are correct
3. Check browser console for error messages
4. Check server logs for backend errors
5. Make sure ports 5173 and 3001 are available

---

**Happy coding! 🚀**
