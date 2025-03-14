'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '../components/Session';

export default function CheckoutPage() {
  const { email } = useSession();
  const router = useRouter();
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    phone: '',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiration: '',
    cvv: '',
    cardHolderName: '',
    billingZip: '',
  });

  const [cartItems, setCartItems] = useState([]);

  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);


  // Fetch cart items on component mount
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Not authenticated');
        }

        const response = await fetch('/api/cart', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCartItems(data.items);
        } else {
          throw new Error('Failed to fetch cart items');
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Not authenticated');
        }

        // Calculate total amount (replace with your actual calculation)
      const totalAmount = cartItems.reduce((total, item) => 
        total + (item.price * item.quantity), 0);

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          shippingInfo,
          paymentInfo,
          cartItems,
          totalAmount, // Add total amount to the request
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/order-confirmation/${data.orderId}`);
      } else {
        const data = await response.json();
        setError(data.message || 'Checkout failed');
      }
    } catch (err) {
      setError('An error occurred during checkout');
    } finally {
      setIsProcessing(false);
    }
  };

  /*const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
    return phoneRegex.test(phone);
  };
  
  // In handleSubmit
  if (!validatePhoneNumber(shippingInfo.phone)) {
    setError('Please enter a valid phone number');
    return;
  }*/

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Shipping Information</h2>
          <div>
            <label htmlFor="fullName" className="block mb-2">Full Name</label>
            <input
              type="text"
              id="fullName"
              value={shippingInfo.fullName}
              onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="address" className="block mb-2">Address</label>
            <input
              type="text"
              id="address"
              value={shippingInfo.address}
              onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="address2" className="block mb-2">Address Line 2 (Optional)</label>
            <input
              type="text"
              id="address2"
              value={shippingInfo.address2}
              onChange={(e) => setShippingInfo({ ...shippingInfo, address2: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block mb-2">City</label>
              <input
                type="text"
                id="city"
                value={shippingInfo.city}
                onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="state" className="block mb-2">State/Province</label>
              <input
                type="text"
                id="state"
                value={shippingInfo.state}
                onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="zip" className="block mb-2">ZIP/Postal Code</label>
              <input
                type="text"
                id="zip"
                value={shippingInfo.zip}
                onChange={(e) => setShippingInfo({ ...shippingInfo, zip: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="country" className="block mb-2">Country</label>
              <select
                id="country"
                value={shippingInfo.country}
                onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                className="w-full p-2 border rounded"
                required
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                {/* Add more countries as needed */}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="phone" className="block mb-2">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={shippingInfo.phone}
              onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        {/* Payment Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Payment Information</h2>
          <div>
            <label htmlFor="cardNumber" className="block mb-2">Card Number</label>
            <input
              type="text"
              id="cardNumber"
              value={paymentInfo.cardNumber}
              onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="4242 4242 4242 4242"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiration" className="block mb-2">Expiration Date</label>
              <input
                type="text"
                id="expiration"
                value={paymentInfo.expiration}
                onChange={(e) => setPaymentInfo({ ...paymentInfo, expiration: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="MM/YY"
                required
              />
            </div>
            <div>
              <label htmlFor="cvv" className="block mb-2">CVV</label>
              <input
                type="text"
                id="cvv"
                value={paymentInfo.cvv}
                onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="123"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="cardHolderName" className="block mb-2">Cardholder Name</label>
            <input
              type="text"
              id="cardHolderName"
              value={paymentInfo.cardHolderName}
              onChange={(e) => setPaymentInfo({ ...paymentInfo, cardHolderName: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label htmlFor="billingZip" className="block mb-2">Billing ZIP Code</label>
            <input
              type="text"
              id="billingZip"
              value={paymentInfo.billingZip}
              onChange={(e) => setPaymentInfo({ ...paymentInfo, billingZip: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="12345"
              required
            />
          </div>
        </div>


        {/* Order Summary */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            {/* ... order items ... */}
            <div className="flex justify-between font-semibold mt-4">
              <span>Total</span>
              <span>$99.99</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isProcessing ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
}