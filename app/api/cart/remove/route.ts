import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../auth/login/route';

const prisma = new PrismaClient();

export async function POST(request: Request) {
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

    const { itemId } = await request.json();

    if (!itemId) {
        return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
        );
    }

    // Remove the item from the cart
    const deletedItem = await prisma.cartItem.delete({
        where: {
            id: itemId,
            cart: {
                userId: decoded.userId, // Ensure the item belongs to the authenticated user
            },
        },
    });

    return NextResponse.json({ success: true, deletedItem });
    } 
    catch (error) {
        console.error('Error removing item from cart:', error);
        return NextResponse.json(
            { error: 'Failed to remove item from cart' },
            { status: 500 }
        );
    } 
    finally {
        await prisma.$disconnect();
    }
}