import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  description: string | null;
}

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    console.log('process.env.NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/featured`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();
    
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Welcome to NextShop</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProducts.map(product => (
            <div key={product.id} className="border p-4 rounded-lg shadow-sm">
              <div className="aspect-square bg-gray-100 mb-4 rounded-lg overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-2">${product.price.toFixed(2)}</p>
              {product.description && (
                <p className="text-sm text-gray-500 mb-4">{product.description}</p>
              )}
              <Link
                href={`/products/${product.id}`}
                className="block text-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                View Product
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ... rest of the page remains the same ... */}
    </div>
  );
}

/*import Link from 'next/link';

const featuredProducts = [
  {
    id: 1,
    name: 'Premium Headphones',
    price: 199.99,
    image: '/images/headphones.jpg',
    description: 'Noise-cancelling wireless headphones',
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 249.99,
    image: '/images/smartwatch.jpg',
    description: 'Fitness tracking and heart rate monitoring',
  },
  {
    id: 3,
    name: 'Wireless Earbuds',
    price: 149.99,
    image: '/images/earbuds.jpg',
    description: 'True wireless earbuds with long battery life',
  },
];

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Welcome to NextShop</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProducts.map(product => (
            <div key={product.id} className="border p-4 rounded-lg shadow-sm">
              <div className="aspect-square bg-gray-100 mb-4 rounded-lg">
                {// Image would go here 
                }
              </div>
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-2">${product.price.toFixed(2)}</p>
              <p className="text-sm text-gray-500 mb-4">{product.description}</p>
              <Link
                href={`/products/${product.id}`}
                className="block text-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                View Product
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Why Choose NextShop?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Fast Shipping</h3>
            <p className="text-gray-600">Get your products delivered quickly and reliably.</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
            <p className="text-gray-600">We use industry-standard encryption for all transactions.</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
            <p className="text-gray-600">Our team is always here to help with any questions.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
*/