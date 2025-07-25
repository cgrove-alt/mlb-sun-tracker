# SeatGeek API Setup Guide

## Overview

The MLB Stadium Sun Tracker integrates with SeatGeek's API to provide real-time ticket pricing and purchase links. This guide explains how to configure the API credentials.

## Getting Started

### Step 1: Create a SeatGeek Developer Account

1. Go to [SeatGeek's Developer Portal](https://seatgeek.com/account/develop)
2. Sign up for a free developer account
3. Verify your email address

### Step 2: Create a New Application

1. Once logged in, click "Create App"
2. Fill in the application details:
   - **App Name**: `MLB Stadium Sun Tracker` (or your preferred name)
   - **Description**: `Integration for MLB Stadium Sun Tracker web app`
   - **Website**: Your domain (e.g., `https://your-domain.com`)
   - **Redirect URI**: Not required for this integration
3. Click "Create App"

### Step 3: Get Your API Credentials

1. After creating the app, you'll see your credentials:
   - **Client ID**: A string like `NzQyMDQ3fDE2ODkxMjM0NTY3.89Ab`
   - **Client Secret**: Optional, but recommended for production

### Step 4: Configure Environment Variables

#### For Development (Local)

Create a `.env.local` file in your project root:

```bash
# .env.local
NEXT_PUBLIC_SEATGEEK_CLIENT_ID=your_client_id_here
NEXT_PUBLIC_SEATGEEK_CLIENT_SECRET=your_client_secret_here
```

#### For Production (Vercel/Netlify)

Set environment variables in your hosting platform:

**Vercel:**
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add:
   - `NEXT_PUBLIC_SEATGEEK_CLIENT_ID` = your client ID
   - `NEXT_PUBLIC_SEATGEEK_CLIENT_SECRET` = your client secret

**Netlify:**
1. Go to Site settings → Environment variables
2. Add the same variables as above

**GitHub Pages:**
Since GitHub Pages doesn't support server-side environment variables, you'll need to:
1. Fork the repository
2. Set the variables in GitHub Secrets
3. Modify the build process to inject them at build time

### Step 5: Verify Configuration

1. Restart your development server
2. Navigate to a game page
3. You should see the ticket search working instead of the configuration message

## API Rate Limits

SeatGeek's free tier includes:
- **5,000 requests per day**
- **1,000 requests per hour**
- **10 requests per minute**

For production applications with higher traffic, consider upgrading to a paid plan.

## Troubleshooting

### Common Issues

**"API Configuration Required" message appears:**
- Ensure environment variables are set correctly
- Restart your development server
- Check that the variable names match exactly: `NEXT_PUBLIC_SEATGEEK_CLIENT_ID`

**"Invalid client credentials" error:**
- Verify your Client ID is correct
- Check for extra spaces or characters
- Ensure the app is active in your SeatGeek developer account

**"Access denied" errors:**
- Your IP might be blocked or rate limited
- Check if you've exceeded rate limits
- Try again after a few minutes

**No tickets found for games:**
- Not all games have tickets available through SeatGeek
- Some venues might not be supported
- Try different stadiums or games

### Debug Mode

To enable debug logging, add this to your browser console:

```javascript
localStorage.setItem('debug', 'seatgeek:*');
```

This will show detailed API requests and responses.

## Security Notes

- Never commit your API credentials to version control
- Use environment variables for all sensitive data
- The `NEXT_PUBLIC_` prefix makes variables available in the browser
- Consider using server-side API routes for additional security

## API Documentation

For more advanced usage, refer to:
- [SeatGeek API Documentation](https://platform.seatgeek.com/)
- [SeatGeek Developer Portal](https://seatgeek.com/account/develop)

## Support

If you encounter issues with the SeatGeek API integration:

1. Check the browser console for error messages
2. Verify your API credentials are correct
3. Ensure you haven't exceeded rate limits
4. Contact SeatGeek support for API-specific issues

## Production Considerations

For production deployments:

1. **Use HTTPS**: SeatGeek requires secure connections
2. **Set up monitoring**: Track API usage and errors
3. **Handle rate limits**: Implement retry logic with exponential backoff
4. **Cache responses**: Store ticket data temporarily to reduce API calls
5. **Error handling**: Gracefully handle API outages and errors

## License & Terms

By using the SeatGeek API, you agree to:
- [SeatGeek API Terms of Service](https://seatgeek.com/terms)
- [SeatGeek Developer Agreement](https://seatgeek.com/developer-agreement)

Make sure to review these terms before deploying to production.