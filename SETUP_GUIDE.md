# SanctifAi Production Setup Guide

This guide will help you set up SanctifAi for production deployment with Google OAuth authentication.

## Prerequisites

1. A Neon PostgreSQL database
2. Google Cloud Console account
3. Production domain or URL

## Step 1: Database Setup

1. Create a Neon database at https://neon.tech
2. Copy your connection string
3. Add it to your `.env` file:
   ```
   DATABASE_URL=postgresql://user:password@your-host.neon.tech/database
   ```
4. Run database migrations:
   ```bash
   npm run db:push
   ```

## Step 2: Google OAuth Setup

### Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized JavaScript origins:
     - `http://localhost:5000` (for development)
     - `https://your-production-domain.com` (for production)
   - Add authorized redirect URIs:
     - `http://localhost:5000/api/auth/google/callback` (for development)
     - `https://your-production-domain.com/api/auth/google/callback` (for production)
   - Click "Create"

5. Copy your credentials and add them to `.env`:
   ```
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

## Step 3: Environment Configuration

Update your `.env` file with production values:

```env
# Google OAuth (from Step 2)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Session Secret (generate a strong random string)
SESSION_SECRET=your-very-long-random-string-at-least-32-characters

# Base URL (your production domain)
BASE_URL=https://your-production-domain.com

# Database
DATABASE_URL=postgresql://user:password@your-host.neon.tech/database

# Optional: OpenAI API for enhanced analysis
OPENAI_API_KEY=your-openai-api-key

# Optional: TMDB API for movie/TV data
TMDB_API_KEY=your-tmdb-api-key
```

### Generating a Session Secret

Run this command to generate a secure session secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 4: Deploy to Production

### Build the Application

```bash
npm run build
```

This creates:
- `dist/public/` - Frontend build
- `dist/index.js` - Backend server

### Start Production Server

```bash
npm start
```

The server will run on the port specified by the `PORT` environment variable (default: 5000).

### Deployment Platforms

#### Replit
1. Push your code to Replit
2. Set environment variables in the Secrets panel
3. The app will auto-deploy

#### Other Platforms (Vercel, Railway, etc.)
1. Set all environment variables in your platform's dashboard
2. Ensure the build command is: `npm run build`
3. Ensure the start command is: `npm start`
4. Update `BASE_URL` to match your production domain

## Step 5: Database Schema

The following new fields have been added to support authentication:

### Users Table
- `googleId` - Google OAuth ID (unique)
- `whatsappNumber` - Optional WhatsApp number for community updates
- `marketingConsent` - User consent for marketing communications
- `hasCompletedOnboarding` - Tracks if user has completed onboarding

The database will automatically create these fields when you run `npm run db:push`.

## New Features

### 1. Google OAuth Authentication
- Users can sign in with their Google account
- Automatic user profile creation
- Session management with PostgreSQL

### 2. Onboarding Modal
- Appears automatically for new users
- Collects WhatsApp number (optional)
- Requests marketing consent
- Can be skipped

### 3. User Menu
- Access to My Library (saved analyses)
- Link to Support page
- Sign out option

### 4. Support Page (`/support`)
- Donation options (PayPal and SnapScan)
- Mission statement
- Transparent fund usage information

## Troubleshooting

### Authentication Not Working
1. Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
2. Check that redirect URIs in Google Console match your `BASE_URL`
3. Ensure `SESSION_SECRET` is set

### Database Errors
1. Verify `DATABASE_URL` is correct
2. Run `npm run db:push` to ensure schema is up to date
3. Check database connection permissions

### 404 Errors in Production
- Ensure the build completed successfully (`npm run build`)
- Verify `dist/public` directory exists and contains files
- Check that the server is serving static files correctly

## Security Notes

1. **Never commit secrets to version control**
2. **Use strong session secrets in production**
3. **Enable HTTPS in production** (required for Google OAuth)
4. **Keep dependencies updated** (`npm audit` regularly)

## Support

For issues or questions, please refer to the main README.md or open an issue in the repository.
