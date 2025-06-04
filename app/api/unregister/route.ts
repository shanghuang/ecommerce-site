// app/api/unregister/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { verifyToken } from '../auth/login/route';

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest) {
  const { password } = await req.json();

  try {
    const headersList = await headers();
    const authToken = headersList.get('authorization')?.split(' ')[1];
    if (!authToken) {
        return NextResponse.json(
            { message: 'Unauthorized' },
            { status: 401 }
        );
    }

    console.log('Received auth token:', authToken);
    const decoded = verifyToken(authToken);
    if (!decoded?.userId) {
        return NextResponse.json(
            { message: 'Invalid authentication token' },
            { status: 401 }
        );
    }
    console.log('Decoded user ID:', decoded.userId);
    // 2. Find user by email
    const user = await prisma.user.findUnique({
      where: { id: decoded?.userId },
    });

    if (!user) {
        console.error('User not found:', decoded?.userId);
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    console.log('User found:', user.email);
    // Validate password (replace with your password verification logic)
    const isPasswordValid = await bcrypt.compare(password, user?.password);
    if (!isPasswordValid) {
        console.error('Invalid password for user:', decoded?.userId);
      return NextResponse.json({ message: 'Invalid password' }, { status: 400 });
    }
    console.log('Password is valid for user:', user.email);
    const updateUser = await prisma.user.delete({
        where: {
            id: decoded?.userId,
        },
    })
    //todo:check if user data are all deleted
    // 1:products
    // 2:orders
    // 3:cart
    // 4:reviews
    // 5:notifications

    console.log('User deleted successfully:', updateUser.email);
    return NextResponse.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Unregister error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}