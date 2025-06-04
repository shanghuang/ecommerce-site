import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export async function GET() {
  try {
    const headersList = await headers();
    const authToken = headersList.get('authorization')?.split(' ')[1];

    console.log('Auth token:', authToken);
    if (!authToken) {
        console.log('Auth token: invalid token');
        return NextResponse.json(
            { message: 'Unauthorized' },
            { status: 401 }
        );
    }
    const decoded = verifyToken(authToken);
    if (!decoded) {
        console.log('Auth token: token decode failed');
        return NextResponse.json(
            { message: 'Invalid authentication token' },
            { status: 401 }
        );
    }
    console.log('Auth token : OK');
    return NextResponse.json(
        { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Login failed', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } 
}
