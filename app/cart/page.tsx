import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function CartPage() {
  const cookieStore = await cookies()
  const cart = cookieStore.get('cart')?.value || '[]';
  const cartItems = JSON.parse(cart);

  const total = cartItems.reduce((sum: number, item: any) => 
    sum + (item.price * item.quantity), 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item: any) => (
              <div key={item.id} className="border p-4 rounded-lg">
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${(item.price * item.quantity).toFixed(2)}</p>
              </div>            ))}
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-bold">Total: ${total.toFixed(2)}</h2>
            <Link 
              href="/checkout"
              className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded"
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
      <Link href="/products" className="mt-4 inline-block text-blue-500">
        &larr; Continue Shopping
      </Link>
    </div>
  );
}