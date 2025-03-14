import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { PrismaClient } from '@prisma/client';
//import { verifyToken } from '@/utils/auth'; // Create this utility function

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const headersList = headers();
    /*const authToken = headersList.get('authorization')?.split(' ')[1];
    
    if (!authToken) {
      return NextResponse.json(
        { message: 'Authentication required to add to cart' },
        { status: 401 }
      );
    }

    // Verify token and get user ID
    const decoded = verifyToken(authToken);
    if (!decoded?.userId) {
      return NextResponse.json(
        { message: 'Invalid authentication token' },
        { status: 401 }
      );
    }*/

    const body = await request.json();
    const { productId, quantity } = body;

    // Validate required fields
    if (!productId || !quantity) {
      return NextResponse.json(
        { message: 'Product ID and quantity are required' },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    const userId = body.userId;//localStorage.getItem('userId');
    // Check if cart exists for user, create if not
    let cart = await prisma.cart.findUnique({
      where: { userId: userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: userId },
      });
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (existingItem) {
      // Update quantity if item exists
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Create new cart item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    return NextResponse.json(
      { message: 'Product added to cart successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}