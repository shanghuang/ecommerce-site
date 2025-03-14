import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../auth/login/route';

const prisma = new PrismaClient();

interface Order {
    id: string;
    status: string;
    total: number;
    items: {
      name: string;
      quantity: number;
      price: number;
    }[];
    shippingInfo: {
      fullName: string;
      address: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
    createdAt: string;
    updatedAt: string;
  }

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const headersList = await headers();
    const authToken = headersList.get('authorization')?.split(' ')[1];
    const { id } = await params;
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

    const order = await prisma.order.findUnique({
      where: { id: (id )},
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        shippingAddress: true,
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify that the order belongs to the authenticated user
    if (order.userId !== decoded.userId) {
      return NextResponse.json(
        { message: 'Unauthorized to view this order' },
        { status: 403 }
      );
    }

    // Format the response
    const formattedOrder = {
      id: order.id,
      status: order.status,
      total: order.total,
      items: order.orderItems.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
      shippingInfo: {
        fullName: order.shippingAddress.fullName,
        address: order.shippingAddress.address,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        zip: order.shippingAddress.zip,
        country: order.shippingAddress.country,
      },
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };

    return NextResponse.json(formattedOrder);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}