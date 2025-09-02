import { NextRequest, NextResponse } from 'next/server';

// Rate limiting: Store request timestamps in memory
const requestLog = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_REQUESTS_PER_WINDOW = 5;

// Helper function to check rate limit
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = requestLog.get(ip) || [];
  
  // Remove old timestamps outside the window
  const recentTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);
  
  if (recentTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return false; // Rate limit exceeded
  }
  
  recentTimestamps.push(now);
  requestLog.set(ip, recentTimestamps);
  
  // Clean up old IPs periodically
  if (requestLog.size > 1000) {
    const entries = Array.from(requestLog.entries());
    for (const [key, value] of entries) {
      if (value.every((t: number) => now - t > RATE_LIMIT_WINDOW)) {
        requestLog.delete(key);
      }
    }
  }
  
  return true;
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Sanitize input to prevent XSS
function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    const { name, email, subject, message, website } = body;
    
    // Check honeypot field (spam prevention)
    if (website) {
      // Honeypot field was filled - likely a bot
      console.log('Honeypot triggered - rejecting submission');
      return NextResponse.json(
        { error: 'Invalid submission' },
        { status: 400 }
      );
    }
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }
    
    // Validate field lengths
    if (name.length > 100 || email.length > 100 || subject.length > 200 || message.length > 5000) {
      return NextResponse.json(
        { error: 'Field length exceeded. Please shorten your input.' },
        { status: 400 }
      );
    }
    
    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      subject: sanitizeInput(subject),
      message: sanitizeInput(message),
      timestamp: new Date().toISOString(),
      ip: ip
    };
    
    // Get Web3Forms API key from environment
    const WEB3FORMS_ACCESS_KEY = process.env.WEB3FORMS_ACCESS_KEY;
    
    if (!WEB3FORMS_ACCESS_KEY) {
      console.error('WEB3FORMS_ACCESS_KEY not configured');
      
      // In development, log the form data instead of sending
      if (process.env.NODE_ENV === 'development') {
        console.log('Contact form submission (dev mode):', sanitizedData);
        return NextResponse.json({
          success: true,
          message: 'Message logged (development mode)',
          data: sanitizedData
        });
      }
      
      return NextResponse.json(
        { error: 'Email service not configured. Please contact us directly at info@theshadium.com' },
        { status: 503 }
      );
    }
    
    // Send email via Web3Forms
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          from_name: sanitizedData.name,
          email: sanitizedData.email,
          subject: `[The Shadium Contact] ${sanitizedData.subject}`,
          message: `
Name: ${sanitizedData.name}
Email: ${sanitizedData.email}
Subject: ${sanitizedData.subject}
Time: ${sanitizedData.timestamp}

Message:
${sanitizedData.message}

---
This message was sent from The Shadium contact form.
          `.trim(),
          // Optional: Add custom email template
          botcheck: false, // We're doing our own bot checking
        })
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        console.error('Web3Forms error:', result);
        return NextResponse.json(
          { error: 'Failed to send message. Please try again or contact us directly.' },
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        success: true,
        message: 'Message sent successfully'
      });
      
    } catch (error) {
      console.error('Error sending email:', error);
      return NextResponse.json(
        { error: 'Failed to send message. Please try again later.' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}

// Handle other methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}