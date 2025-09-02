# Contact Form Setup Guide

The contact form on The Shadium uses Web3Forms to send emails. This guide explains how to set it up.

## Why Web3Forms?

- **Free tier**: 250 submissions per month
- **No backend required**: Works with static sites
- **No dependencies**: Simple API integration
- **Privacy-focused**: No tracking or cookies
- **Reliable delivery**: Good email deliverability

## Setup Instructions

### 1. Get Your API Key

1. Visit [Web3Forms](https://web3forms.com)
2. Enter your email address where you want to receive form submissions
3. Click "Create Access Key"
4. Check your email and confirm your address
5. Copy your access key

### 2. Configure Environment Variable

#### For Local Development

Create a `.env.local` file in the project root:

```bash
WEB3FORMS_ACCESS_KEY=your_access_key_here
```

#### For Production (Vercel)

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add a new variable:
   - Name: `WEB3FORMS_ACCESS_KEY`
   - Value: Your Web3Forms access key
   - Environment: Production (and Preview if desired)

### 3. Test the Form

In development mode, if no API key is configured, form submissions will be logged to the console instead of being sent via email.

## Features Implemented

### Spam Prevention
- **Honeypot field**: Hidden field that bots typically fill
- **Rate limiting**: Maximum 5 submissions per hour per IP
- **Input validation**: All fields are validated and sanitized
- **Field length limits**: Prevents extremely long submissions

### User Experience
- **Loading states**: Visual feedback during submission
- **Success/error messages**: Clear feedback after submission
- **Form clearing**: Successful submissions clear the form
- **Field preservation**: Form data preserved on errors

### Security
- **XSS prevention**: All inputs are sanitized
- **Rate limiting**: Prevents abuse
- **Server-side validation**: Never trust client input
- **Error handling**: Graceful degradation

## Alternative Email Services

If you prefer a different email service, you can modify `/app/api/contact/route.ts` to use:

### Formspree
```javascript
const response = await fetch(`https://formspree.io/f/${FORM_ID}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});
```

### SendGrid
```javascript
// Requires @sendgrid/mail package
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
await sgMail.send(msg);
```

### Nodemailer (Self-hosted SMTP)
```javascript
// Requires nodemailer package
const transporter = nodemailer.createTransport(smtpConfig);
await transporter.sendMail(mailOptions);
```

## Troubleshooting

### Form not sending in production
1. Verify the environment variable is set in Vercel
2. Check the Vercel function logs for errors
3. Ensure the Web3Forms access key is valid

### Rate limit errors
- The form allows 5 submissions per hour per IP
- This resets after 1 hour
- Adjust `MAX_REQUESTS_PER_WINDOW` in the API route if needed

### Emails not received
1. Check your spam folder
2. Verify the email address associated with your Web3Forms key
3. Check Web3Forms dashboard for submission logs

## Development Mode

When `WEB3FORMS_ACCESS_KEY` is not set and `NODE_ENV=development`:
- Form submissions are logged to the console
- No actual emails are sent
- Perfect for testing without using API quota

## Support

For issues with:
- The Shadium contact form: Create an issue in this repository
- Web3Forms service: Visit their [documentation](https://docs.web3forms.com)
- Email delivery: Check Web3Forms [status page](https://status.web3forms.com)