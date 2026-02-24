import { NextRequest, NextResponse } from 'next/server';

/**
 * User Feedback Analytics API
 * Aggregates and provides insights from user-reported issues
 */

// In-memory storage for aggregated feedback data
// This will be populated by the report-inaccuracy endpoint
const feedbackStore: Map<string, {
  stadiumId: string;
  stadiumName: string;
  totalReports: number;
  byIssueType: Record<string, number>;
  lastReported: number;
}> = new Map();

const recentFeedback: Array<{
  stadiumId: string;
  stadiumName: string;
  section?: string;
  issueType: string;
  description: string;
  timestamp: number;
  status: 'new' | 'reviewed' | 'resolved';
}> = [];

const MAX_FEEDBACK = 500;

/**
 * POST /api/admin/analytics/user-feedback
 * Track user feedback submission
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { stadiumId, stadiumName, section, issueType, description } = payload;

    // Validation
    if (!stadiumId || !issueType) {
      return NextResponse.json(
        { error: 'Stadium ID and issue type are required' },
        { status: 400 }
      );
    }

    // Update aggregated feedback
    const existing = feedbackStore.get(stadiumId);
    if (existing) {
      existing.totalReports++;
      existing.byIssueType[issueType] = (existing.byIssueType[issueType] || 0) + 1;
      existing.lastReported = Date.now();
    } else {
      feedbackStore.set(stadiumId, {
        stadiumId,
        stadiumName: stadiumName || stadiumId,
        totalReports: 1,
        byIssueType: { [issueType]: 1 },
        lastReported: Date.now(),
      });
    }

    // Store recent feedback
    recentFeedback.push({
      stadiumId,
      stadiumName: stadiumName || stadiumId,
      section,
      issueType,
      description: description || 'No description provided',
      timestamp: Date.now(),
      status: 'new',
    });

    // Trim if too large
    if (recentFeedback.length > MAX_FEEDBACK) {
      recentFeedback.splice(0, recentFeedback.length - MAX_FEEDBACK);
    }

    return NextResponse.json(
      { success: true, message: 'Feedback tracked' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to track user feedback:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track feedback' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/analytics/user-feedback
 * Get user feedback analytics
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    const issueType = searchParams.get('issueType') || 'all';
    const status = searchParams.get('status') || 'all';

    // Get stadiums with most reports
    let stadiumsWithIssues = Array.from(feedbackStore.values())
      .sort((a, b) => b.totalReports - a.totalReports)
      .slice(0, limit);

    // Get recent feedback
    let recentItems = [...recentFeedback].reverse();

    // Filter by issue type
    if (issueType !== 'all') {
      recentItems = recentItems.filter(item => item.issueType === issueType);
    }

    // Filter by status
    if (status !== 'all') {
      recentItems = recentItems.filter(item => item.status === status);
    }

    // Limit recent items
    recentItems = recentItems.slice(0, 50);

    // Calculate issue type distribution
    const issueTypeDistribution: Record<string, number> = {};
    recentFeedback.forEach(item => {
      issueTypeDistribution[item.issueType] =
        (issueTypeDistribution[item.issueType] || 0) + 1;
    });

    // Calculate status distribution
    const statusDistribution = {
      new: recentFeedback.filter(f => f.status === 'new').length,
      reviewed: recentFeedback.filter(f => f.status === 'reviewed').length,
      resolved: recentFeedback.filter(f => f.status === 'resolved').length,
    };

    // Calculate feedback trends (last 7 days vs previous 7 days)
    const now = Date.now();
    const last7Days = recentFeedback.filter(
      f => now - f.timestamp < 7 * 24 * 60 * 60 * 1000
    ).length;
    const previous7Days = recentFeedback.filter(
      f => now - f.timestamp >= 7 * 24 * 60 * 60 * 1000 &&
           now - f.timestamp < 14 * 24 * 60 * 60 * 1000
    ).length;

    const trend = previous7Days > 0
      ? ((last7Days - previous7Days) / previous7Days) * 100
      : 0;

    return NextResponse.json({
      stadiumsWithIssues,
      recentFeedback: recentItems.map(item => ({
        ...item,
        timestamp: new Date(item.timestamp).toISOString(),
      })),
      summary: {
        totalFeedback: recentFeedback.length,
        totalStadiums: feedbackStore.size,
        issueTypeDistribution,
        statusDistribution,
        feedbackTrend: {
          last7Days,
          previous7Days,
          percentageChange: Math.round(trend),
        },
      },
    });
  } catch (error) {
    console.error('Failed to get user feedback analytics:', error);
    return NextResponse.json(
      { error: 'Failed to get analytics' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/analytics/user-feedback
 * Update feedback status
 */
export async function PATCH(request: NextRequest) {
  try {
    const payload = await request.json();
    const { feedbackIndex, status } = payload;

    if (typeof feedbackIndex !== 'number' || !status) {
      return NextResponse.json(
        { error: 'Feedback index and status are required' },
        { status: 400 }
      );
    }

    if (!['new', 'reviewed', 'resolved'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Update status
    if (feedbackIndex >= 0 && feedbackIndex < recentFeedback.length) {
      recentFeedback[feedbackIndex].status = status;
      return NextResponse.json({
        success: true,
        message: 'Status updated',
      });
    } else {
      return NextResponse.json(
        { error: 'Feedback not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Failed to update feedback status:', error);
    return NextResponse.json(
      { error: 'Failed to update status' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/analytics/user-feedback
 * Clear feedback data (development only)
 */
export async function DELETE(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 403 }
    );
  }

  feedbackStore.clear();
  recentFeedback.length = 0;

  return NextResponse.json({
    success: true,
    message: 'Feedback data cleared',
  });
}
