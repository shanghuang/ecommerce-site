import { cookies } from 'next/headers';
import Link from 'next/link';

const products = [
  {
    id: 1,
    name: 'Premium Headphones',
    price: 199.99,
    description: 'Experience superior sound quality with our noise-cancelling wireless headphones.',
    features: [
      'Active noise cancellation',
      '30-hour battery life',
      'Bluetooth 5.0 connectivity',
      'Comfortable over-ear design',
      'Built-in microphone'
    ],
    image: '/images/headphones.jpg'
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 249.99,
    description: 'Stay connected and track your fitness with our advanced smart watch.',
    features: [
      'Heart rate monitoring',
      'GPS tracking',
      'Water resistant up to 50m',
      '7-day battery life',
      'Customizable watch faces'
    ],
    image: '/images/smartwatch.jpg'
  },
  {
    id: 3,
    name: 'Wireless Earbuds',
    price: 149.99,
    description: 'Enjoy true wireless freedom with our high-quality earbuds.',
    features: [
      'True wireless stereo',
      '24-hour total battery life',
      'Touch controls',
      'IPX5 water resistance',
      'Compact charging case'
    ],
    image: '/images/earbuds.jpg'
  }
];

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const {id} = await params;
  //const product = products.find(p => p.id === Number(params.id));
  const product = products.find(p => p.id === Number(id));
  
  if (!product) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link href="/products" className="text-blue-500 hover:underline">
          &larr; Back to Products
        </Link>
      </div>
    );
  }

  const addToCart = async () => {
    'use server';
    const cookieStore = await cookies()
    const cart = cookieStore.get('cart')?.value || '[]';
    const cartItems = JSON.parse(cart);
    const existingItem = cartItems.find((item: any) => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({ ...product, quantity: 1 });
    }
    
    cookieStore.set('cart', JSON.stringify(cartItems));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-gray-100 rounded-lg p-8">
          <div className="aspect-square bg-white rounded-lg">
            {/* Image would go here */}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold text-gray-800 mb-6">
            ${product.price.toFixed(2)}
          </p>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Features</h2>
            <ul className="list-disc list-inside text-gray-600">
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          <form action={addToCart}>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add to Cart
            </button>
          </form>
        </div>
      </div>

      <Link href="/products" className="mt-8 inline-block text-blue-500 hover:underline">
        &larr; Back to Products
      </Link>
    </div>
  );
}