import { NextRequest, NextResponse } from 'next/server';

interface ReportInaccuracyPayload {
  stadium: string;
  stadiumName: string;
  section?: string;
  issueType: 'shade-data' | 'section-info' | 'obstruction' | 'pricing' | 'other';
  description: string;
  email?: string;
  timestamp: string;
}

// Validation helpers
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePayload = (payload: any): { valid: boolean; error?: string } => {
  // Required fields
  if (!payload.stadium || typeof payload.stadium !== 'string') {
    return { valid: false, error: 'Stadium ID is required' };
  }

  if (!payload.stadiumName || typeof payload.stadiumName !== 'string') {
    return { valid: false, error: 'Stadium name is required' };
  }

  if (!payload.issueType || !['shade-data', 'section-info', 'obstruction', 'pricing', 'other'].includes(payload.issueType)) {
    return { valid: false, error: 'Valid issue type is required' };
  }

  if (!payload.description || typeof payload.description !== 'string') {
    return { valid: false, error: 'Description is required' };
  }

  // Description length validation
  const descriptionTrimmed = payload.description.trim();
  if (descriptionTrimmed.length < 10) {
    return { valid: false, error: 'Description must be at least 10 characters' };
  }

  if (descriptionTrimmed.length > 1000) {
    return { valid: false, error: 'Description must be less than 1000 characters' };
  }

  // Optional fields validation
  if (payload.section && typeof payload.section !== 'string') {
    return { valid: false, error: 'Section must be a string' };
  }

  if (payload.section && payload.section.length > 50) {
    return { valid: false, error: 'Section name must be less than 50 characters' };
  }

  if (payload.email) {
    if (typeof payload.email !== 'string') {
      return { valid: false, error: 'Email must be a string' };
    }
    if (!validateEmail(payload.email.trim())) {
      return { valid: false, error: 'Invalid email format' };
    }
  }

  return { valid: true };
};

// Airtable API integration
const sendToAirtable = async (payload: ReportInaccuracyPayload): Promise<void> => {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!apiKey || !baseId) {
    console.warn('Airtable credentials not configured. Report saved to logs only.');
    // Log to console as fallback
    console.log('Report submission:', JSON.stringify(payload, null, 2));
    return;
  }

  const tableName = 'Report Submissions'; // You can configure this via env var if needed

  const response = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fields: {
        'Stadium ID': payload.stadium,
        'Stadium Name': payload.stadiumName,
        'Section': payload.section || '',
        'Issue Type': payload.issueType,
        'Description': payload.description,
        'Email': payload.email || '',
        'Timestamp': payload.timestamp,
        'Status': 'New',
        'User Agent': '', // Will be added from headers
        'IP Country': '', // Will be added from Vercel headers
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Airtable API error:', errorText);
    throw new Error(`Failed to save to Airtable: ${response.status}`);
  }

  const data = await response.json();
  console.log('Report saved to Airtable:', data.id);
};

// Rate limiting (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5; // Max 5 submissions per hour per IP

const checkRateLimit = (identifier: string): { allowed: boolean; retryAfter?: number } => {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || record.resetAt < now) {
    // New window
    rateLimitMap.set(identifier, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW,
    });
    return { allowed: true };
  }

  if (record.count >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  // Increment count
  record.count += 1;
  return { allowed: true };
};

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const payload: ReportInaccuracyPayload = await request.json();

    // Validate payload
    const validation = validatePayload(payload);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';

    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many submissions. Please try again later.',
          retryAfter: rateLimit.retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfter),
          },
        }
      );
    }

    // Add metadata from request
    const enrichedPayload = {
      ...payload,
      metadata: {
        userAgent: request.headers.get('user-agent') || 'unknown',
        country: request.headers.get('x-vercel-ip-country') || 'unknown',
        city: request.headers.get('x-vercel-ip-city') || 'unknown',
        ip: ip,
      },
    };

    // Send to Airtable
    try {
      await sendToAirtable(payload);
    } catch (airtableError) {
      console.error('Airtable submission failed:', airtableError);

      // Still log locally even if Airtable fails
      console.log('Report submission (Airtable failed):', JSON.stringify(enrichedPayload, null, 2));

      // Don't fail the request - we've logged it
      // In production, you might want to queue this for retry
    }

    // Track in analytics system
    try {
      await fetch(`${request.nextUrl.origin}/api/admin/analytics/user-feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stadiumId: payload.stadium,
          stadiumName: payload.stadiumName,
          section: payload.section,
          issueType: payload.issueType,
          description: payload.description,
        }),
      });
    } catch (analyticsError) {
      console.error('Failed to track in analytics:', analyticsError);
      // Don't fail the request
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Report submitted successfully. Thank you for your feedback!',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to process report:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit report. Please try again.',
      },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint for development/testing
export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 403 }
    );
  }

  return NextResponse.json({
    message: 'Report Inaccuracy API',
    endpoint: 'POST /api/report-inaccuracy',
    requiredFields: ['stadium', 'stadiumName', 'issueType', 'description'],
    optionalFields: ['section', 'email'],
    issueTypes: ['shade-data', 'section-info', 'obstruction', 'pricing', 'other'],
    rateLimit: `${RATE_LIMIT_MAX} submissions per ${RATE_LIMIT_WINDOW / 1000 / 60} minutes`,
  });
}
