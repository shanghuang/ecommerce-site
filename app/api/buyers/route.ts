import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { verifyToken } from '../auth/login/route';
import { getBuyersForProvider } from '../../lib/buyers'; // We'll create this next
//import { getSession } from '@/lib/session'; // Assuming you have a session management system

export async function GET() {
  try {
    const headersList = await headers();
    const authToken = headersList.get('authorization')?.split(' ')[1];
    
    if (!authToken) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(authToken);
    if (!decoded?.userId) {
      return NextResponse.json(
        { message: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    const buyers = await getBuyersForProvider(decoded?.email);
    return NextResponse.json({ buyers });
  } catch (error) {
    console.error('Error fetching buyers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch buyers' },
      { status: 500 }
    );
  }
}
