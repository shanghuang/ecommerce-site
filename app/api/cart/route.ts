import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../auth/login/route';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const headersList = await headers();
    const authToken = headersList.get('authorization')?.split(' ')[1];
    
    if (!authToken) {
      return NextResponse.json(
        { message: 'Authentication required' },
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

    const cart = await prisma.cart.findUnique({
      where: { userId: decoded.userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ items: [] });
    }

    const items = cart.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
      name: item.product.name,
      imageUrl: item.product.imageUrl,
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}