# Google OAuth Setup Guide for CareerSync

This guide will help you enable Google OAuth in your Supabase project.

## Prerequisites
- Supabase Account (https://supabase.com)
- Google Cloud Account (https://console.cloud.google.com)

## Step 1: Get Your Supabase Project Info

Your current Supabase project:
- **Project ID**: `fhlqcejpmbrftmejauxd`
- **Project URL**: `https://fhlqcejpmbrftmejauxd.supabase.co`
- **Callback URL**: `https://fhlqcejpmbrftmejauxd.supabase.co/auth/v1/callback`

## Step 2: Create Google OAuth Credentials

### 2.1 Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/
2. Sign in with your Google account
3. Click on the project dropdown at the top
4. Click "NEW PROJECT"
5. Enter project name: `CareerSync`
6. Click "CREATE"

### 2.2 Enable Google+ API
1. In the search bar, search for "Google+ API"
2. Click on the result
3. Click "ENABLE"
4. Wait for it to enable (takes a few seconds)

### 2.3 Create OAuth 2.0 Credentials
1. Go to **Credentials** (left sidebar)
2. Click **CREATE CREDENTIALS** → **OAuth 2.0 Client IDs**
3. You'll see a popup asking for consent screen setup
   - Click "CONFIGURE CONSENT SCREEN"
   - Choose "External"
   - Click "CREATE"

### 2.4 Fill Out OAuth Consent Screen
1. **App name**: `CareerSync`
2. **User support email**: Your email address
3. **Developer contact information**: Your email address
4. Click "SAVE AND CONTINUE"
5. Skip through remaining screens (Scopes, Test Users)
6. Click "BACK TO DASHBOARD"

### 2.5 Create OAuth Credentials
1. Go back to **Credentials**
2. Click **CREATE CREDENTIALS** → **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Name: `CareerSync Web`
5. Under **Authorized redirect URIs**, add:
   ```
   https://fhlqcejpmbrftmejauxd.supabase.co/auth/v1/callback
   ```
   
   **For local development, also add:**
   ```
   http://localhost:5173/auth/v1/callback
   http://localhost:5174/auth/v1/callback
   ```

6. Click "CREATE"
7. You'll see a popup with:
   - **Client ID** (something like: `xxxxx-xxxxxx.apps.googleusercontent.com`)
   - **Client Secret** (something like: `GOCSPX-xxxxx`)
   
   **Copy these values** - you'll need them in the next step!

## Step 3: Enable Google OAuth in Supabase

1. Go to: https://app.supabase.com
2. Sign in and select your project `fhlqcejpmbrftmejauxd`
3. In the left sidebar, click **Authentication**
4. Click **Providers**
5. Find **Google** in the list and click on it
6. Toggle **Enable Sign in with Google** to **ON**
7. Paste your credentials:
   - **Client ID** (from Google Console)
   - **Client Secret** (from Google Console)
8. Click **SAVE**

## Step 4: Test Your Setup

1. Go to: http://localhost:5174 (or your local dev URL)
2. You should be able to click "Continue with Google"
3. You'll be redirected to Google's login page
4. After signing in, you'll be redirected back to your app
5. You should see the dashboard!

## Troubleshooting

### Error: "Unsupported provider: provider is not enabled"
- **Solution**: Make sure you toggled the Google provider ON in Supabase Authentication → Providers

### Error: "Invalid client_id"
- **Solution**: Check that your Client ID matches exactly in Supabase. Copy-paste to avoid typos.

### Redirect URL mismatch
- **Solution**: Make sure you added `https://fhlqcejpmbrftmejauxd.supabase.co/auth/v1/callback` to Google's authorized redirect URIs

### Still not working?
1. Refresh the Supabase page
2. Clear your browser cache
3. Wait 5-10 minutes for Google to propagate the changes
4. Try again

## Need Help?

- Supabase Docs: https://supabase.com/docs/guides/auth/social-login/auth-google
- Google OAuth Docs: https://developers.google.com/identity/protocols/oauth2/web-server-flow
