import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // You can add more health checks here in the future
    // For example: database connectivity, external API status, etc.
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'mlb-sun-tracker',
      version: process.env.npm_package_version || '0.2.0',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };

    return NextResponse.json(health, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    );
  }
}