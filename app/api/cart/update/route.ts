import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../auth/login/route';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const headersList = await headers();
        //console.log("headersList: "); console.log(headersList);
        const authToken = headersList.get('authorization')?.split(' ')[1];
        
        console.log("authToken: "); console.log(authToken);
    
        if (!authToken) {
            return NextResponse.json(
                { message: 'Authentication required' },
                { status: 401 }
            );
        }
    
        const decoded = verifyToken(authToken);
        console.log("decoded: "); console.log(decoded);
    
        if (!decoded?.userId) {
            return NextResponse.json(
            { message: 'Invalid authentication token' },
            { status: 401 }
            );
        }
        
        const { itemId, quantity } = await request.json();
        console.log("itemId: "); console.log(itemId);
        console.log("quantity: "); console.log(quantity);

        // Validate input
        if (!itemId || typeof quantity !== 'number' || quantity < 1) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        // Update the cart item in the database
        const updatedCartItem = await prisma.cartItem.update({
            where: {
                id: itemId/*,
                decoded?.userId,*/ // Ensure the item belongs to the authenticated user
            },
            data: {
                quantity,
            },
        });

        return NextResponse.json({ success: true, updatedCartItem });
    } 
    catch (error) {
        console.error('Error updating cart item:', error);
        return NextResponse.json(
            { error: 'Failed to update cart item' },
            { status: 500 }
        );
    }
}
