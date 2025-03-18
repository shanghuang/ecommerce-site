import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../auth/login/route';

const prisma = new PrismaClient();

export async function GET() {
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


    const products = await prisma.product.findMany({
      where: { "providerId": decoded?.userId },
      orderBy: { createdAt: 'desc' },
    });

    /*const products = await prisma.product.findMany({
      where: {
        isFeatured: true, // Assuming you have an isFeatured field
      },
      take: 3, // Limit to 3 featured products
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        price: true,
        imageUrl: true,
        description: true,
      },
    });*/

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured products' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}


