import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // For now, return mock data until database is properly set up
    // In the future, this will fetch real data from the database
    const mockStats = {
      users: 1247,
      jobs: 892,
      companies: 156,
      successRate: 87,
      countries: 23
    };

    return NextResponse.json(mockStats);

  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
} 