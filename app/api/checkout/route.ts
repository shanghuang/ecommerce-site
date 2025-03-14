import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../auth/login/route';

const prisma = new PrismaClient();

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

export async function POST(request: Request) {
  try {
    debugger;
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

    const body = await request.json();
    const { email, shippingInfo, paymentInfo, cartItems, totalAmount } = body;

    // Validate required fields
    if (!email || !shippingInfo || !paymentInfo || !cartItems || !totalAmount) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate cart items
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { message: 'Invalid cart items' },
        { status: 400 }
      );
    }

    // Validate payment information (basic example)
    if (!isValidPayment(paymentInfo)) {
      return NextResponse.json(
        { message: 'Invalid payment information' },
        { status: 400 }
      );
    }

    // Get user from database
    /*const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }*/

    //const totalAmount = calculateTotalAmount();
    // Create order in database
    const order = await prisma.order.create({
      data: {
        user: {
          connect: { id: decoded.userId } // Connect to existing user
        },
        //userId: user.id,
        total: totalAmount,
        status: 'pending',
        shippingAddress: {
          create: {
            fullName: shippingInfo.fullName,
            address: shippingInfo.address,
            city: shippingInfo.city,
            state: shippingInfo.state,
            zip: shippingInfo.zip,
            country: shippingInfo.country,
            phone: shippingInfo.phone,
          }
        },
        orderItems: {
          create: cartItems.map(item => ({
            product: {
              connect: { id: item.productId }
            },
            quantity: item.quantity,
            price: item.price,
          }))
        }
      },
      include: {
        /*user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        shippingAddress: true,*/
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });

    // Process payment (this would be replaced with actual payment gateway integration)
    const paymentResult = await processPayment(paymentInfo, order.totalAmount);

    if (!paymentResult.success) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'payment_failed' },
      });
      return NextResponse.json(
        { message: 'Payment failed' },
        { status: 402 }
      );
    }

    // Update order status to paid and add payment ID
    await prisma.order.update({
        where: { id: order.id },
        data: { 
          status: 'paid',
          paymentId: paymentResult.paymentId,
        },
      });

      // Clear the user's cart after successful checkout
    await prisma.cartItem.deleteMany({
      where: {
        cart: {
          userId: decoded.userId
        }
      }
    });

    return NextResponse.json(
      { 
        message: 'Order processed successfully',
        orderId: order.id,
        paymentId: paymentResult.paymentId,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Helper functions (implement these according to your needs)
function isValidPayment(paymentInfo: any): boolean {
  // Implement proper payment validation
  return !!paymentInfo.cardNumber && !!paymentInfo.expiration && !!paymentInfo.cvv;
}

/*function getOrderItems() {
  /// This should be replaced with your actual cart items
  const cartItems = [
    { productId: 'prod_123', quantity: 1, price: 49.99 },
    { productId: 'prod_456', quantity: 2, price: 25.00 }
  ];

  return cartItems.map(item => ({
    product: {
      connect: { id: item.productId }
    },
    quantity: item.quantity,
    price: item.price
  }));
}*/

/*async function processPayment(paymentInfo: any, amount: number) {
  // Implement your payment gateway integration
  // This is just a mock implementation
  return { success: true, paymentId: 'pay_123' };
}*/

/*async function createOrder(orderData: any) {
    const { email, shippingInfo, paymentInfo, totalAmount, status } = orderData;
  
    return await prisma.order.create({
      data: {
        email,
        fullName: shippingInfo.fullName,
        address: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        zip: shippingInfo.zip,
        country: shippingInfo.country,
        totalAmount,
        status,
      },
    });
  }
*/
/*async function updateOrderStatus(orderId: string, status: string) {
    return await prisma.order.update({
        where: { id: orderId },
        data: { status },
      });
}*/

async function processPayment(paymentInfo: any, amount: number) {
  // Implement your payment gateway integration
  // This is just a mock implementation
  return { success: true, paymentId: 'pay_123' };
}

/*function calculateTotalAmount() {
  // Implement your total calculation logic
  return 99.99; // Replace with actual calculation
}*/