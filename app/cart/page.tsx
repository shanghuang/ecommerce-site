'use client'; // Mark this as a Client Component
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function CartPage() {
  const t = useTranslations('Cart');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const token = localStorage.getItem('token'); // Access localStorage
        if (!token) {
          throw new Error('User not authenticated');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch cart data');
        }

        const data = await response.json();
        console.log("cart data:");  console.log(data);
        setCartItems(data.items || []);
        //setTotal(data.cartItems.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load cart');
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  if (loading) {
    return <div className="container mx-auto p-4">Loading cart...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t('yourCart')}</h1>

      {cartItems.length === 0 ? (
        <p>{t('yourCartIsEmpty')}</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="border p-4 rounded-lg">
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p>
                  {t('quantity')}: {item.quantity}
                </p>
                <p>
                  {t('price')}: ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <h2 className="text-xl font-bold">
              {t('total')}: ${total.toFixed(2)}
            </h2>
            <Link
              href="/checkout"
              className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded"
            >
              {t('proceedToCheckout')}
            </Link>
          </div>
        </>
      )}

      <Link href="/products" className="mt-4 inline-block text-blue-500">
        &larr; {t('continueShopping')}
      </Link>
    </div>
  );
}
/*
export default async function CartPage() {

  const t = await getTranslations('Cart');    //async function use getTranslations to get the translations for the Cart page

  const cookieStore = await cookies()
  const cart = cookieStore.get('cart')?.value || '[]';
  const cartItems = JSON.parse(cart);

  const total = cartItems.reduce((sum: number, item: any) => 
    sum + (item.price * item.quantity), 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t("yourCart")}</h1>
      {cartItems.length === 0 ? (
        <p>{t("yourCartIsEmpty")}</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item: any) => (
              <div key={item.id} className="border p-4 rounded-lg">
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p>{t("quantity")}: {item.quantity}</p>
                <p>{t("price")}: ${(item.price * item.quantity).toFixed(2)}</p>
              </div>            ))}
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-bold">{t("total")}: ${total.toFixed(2)}</h2>
            <Link 
              href="/checkout"
              className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded"
            >
              {t("proceedToCheckout")}
            </Link>
          </div>
        </>
      )}
      <Link href="/products" className="mt-4 inline-block text-blue-500">
        &larr; {t("continueShopping")}
      </Link>
    </div>
  );
}
  */