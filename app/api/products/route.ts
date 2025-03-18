import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../auth/login/route';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const authToken = headersList.get('authorization')?.split(' ')[1];
    
    // Authentication check
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

    const body = await request.json();
    const { name, description, price, imageUrl, categoryId } = body;

    // Validate required fields
    if (!name || !price) {
      return NextResponse.json(
        { message: 'Name and price are required' },
        { status: 400 }
      );
    }

    // Create new product
    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price,
        imageUrl: imageUrl || null,
        provider: {
          connect: { id: decoded.userId }
        },
        category: categoryId ? {
          connect: { id: categoryId }
        } : undefined,
      },
      include: {
        category: true,
      }
    });

    return NextResponse.json(
      { 
        message: 'Product created successfully',
        product,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Product creation error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}