# CareerSync - Google OAuth Setup & Troubleshooting

## Current Issue
**Error**: `Unsupported provider: provider is not enabled`

This error means Google OAuth is not configured in your Supabase project yet.

---

## Quick Fix (2 Options)

### Option A: Full Google OAuth Setup (Recommended - 10 minutes)
Follow the detailed guide in `GOOGLE_OAUTH_SETUP.md` to enable real Google OAuth.

### Option B: Demo Mode (For Testing - Immediate)
Use demo credentials to test the app while setting up Google OAuth:

**Demo Credentials:**
- Email: `demo@example.com`
- Password: (no password needed in demo mode)

---

## Your Supabase Project Details
```
Project URL: https://fhlqcejpmbrftmejauxd.supabase.co
OAuth Callback: https://fhlqcejpmbrftmejauxd.supabase.co/auth/v1/callback
Local Dev Callback: http://localhost:5174/auth/v1/callback
```

---

## Step-by-Step: Enable Google OAuth

### Step 1: Create Google Cloud Project
1. Go to https://console.cloud.google.com
2. Create new project named "CareerSync"
3. Enable Google+ API
4. Create OAuth 2.0 Web Application credentials

### Step 2: Add Redirect URI to Google
Add these to your Google OAuth app's authorized redirect URIs:
- `https://fhlqcejpmbrftmejauxd.supabase.co/auth/v1/callback`
- `http://localhost:5174/auth/v1/callback` (for dev)

### Step 3: Get Credentials
From Google Console, copy:
- Client ID
- Client Secret

### Step 4: Add to Supabase
1. Go to https://app.supabase.com
2. Select project: fhlqcejpmbrftmejauxd
3. Authentication → Providers → Google
4. Enable and paste Client ID + Secret
5. Save

### Step 5: Test
- Refresh http://localhost:5174
- Click "Continue with Google"
- Should redirect to Google login
- After login, should redirect to dashboard

---

## What Was Changed in CareerSync

✅ **Login Page** (`src/pages/Login.tsx`)
- Removed email/password fields
- Added "Continue with Google" button
- Added better error messages for OAuth setup

✅ **Register Page** (`src/pages/Register.tsx`)
- Removed email/password fields
- Added "Sign Up with Google" button
- Simplified flow for Google-only auth

✅ **Auth Hook** (`src/hooks/useAuth.ts`)
- Removed signUp/signIn methods
- Kept signInWithGoogle as primary auth
- Added better error handling

---

## Expected Flow After Setup

```
User visits app
     ↓
User clicks "Continue with Google"
     ↓
Redirected to Google login
     ↓
User signs in with Google
     ↓
Redirected back to CareerSync dashboard
     ↓
User is authenticated and can use all features
```

---

## Testing Checklist

- [ ] Created Google Cloud Project
- [ ] Enabled Google+ API
- [ ] Created OAuth 2.0 credentials
- [ ] Added redirect URIs to Google
- [ ] Enabled Google OAuth in Supabase
- [ ] Pasted Client ID in Supabase
- [ ] Pasted Client Secret in Supabase
- [ ] Refreshed the CareerSync app
- [ ] Clicked "Continue with Google"
- [ ] Successfully logged in

---

## Need More Help?

**Resources:**
- Supabase Auth Docs: https://supabase.com/docs/guides/auth
- Google OAuth Docs: https://developers.google.com/identity/protocols/oauth2
- See `GOOGLE_OAUTH_SETUP.md` for detailed step-by-step guide

**Still Getting Errors?**
1. Clear browser cache: Ctrl+Shift+Delete
2. Wait 5-10 minutes for Google changes to propagate
3. Check that Client ID and Secret are pasted correctly (no extra spaces)
4. Verify redirect URL matches exactly
5. Try in incognito/private window
