'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ProductChat } from '../../components/ProductChat';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  providerEmail: string;
  category?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const t = useTranslations('ProductDetail');
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        setProduct(data.product);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    if (!product) return;

    setAddingToCart(true);
    setCartMessage(null);

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          userId: userId,
          productId: product.id,
          quantity: 1,
        }),
      });

      if (response.ok) {
        setCartMessage({
          type: 'success',
          text: t("productAddedToCart")
        });
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to add product to cart');
      }
    } catch (error) {
      setCartMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to add to cart'
      });
    } finally {
      setAddingToCart(false);
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setCartMessage(null);
      }, 3000);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading product details...</div>;
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

  if (!product) {
    return <div className="container mx-auto p-4">{t("productNotFound")}</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {cartMessage && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-md ${
          cartMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {cartMessage.text}
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">No image available</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          
          {product.category && (
            <div className="text-sm text-gray-600">
              Category: <span className="font-medium">{product.category.name}</span>
            </div>
          )}

          <div className="text-2xl font-semibold">
            ${product.price.toFixed(2)}
          </div>

          {product.description && (
            <div className="prose max-w-none">
              <h3 className="text-xl font-semibold mb-2">{t("description")}</h3>
              <p>{product.description}</p>
            </div>
          )}

          <div className="text-sm text-gray-600 space-y-1">
            <div>Created: {new Date(product.createdAt).toLocaleDateString()}</div>
            <div>Last updated: {new Date(product.updatedAt).toLocaleDateString()}</div>
            <div>Provider: {product.providerEmail}</div>
          </div>

          <button
            onClick={addToCart}
            disabled={addingToCart}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300"
          >
            {addingToCart ? t("addingToCart") : t("addToCart")}
          </button>
          {/* Chat Section */}
          <ProductChat productId={product.id} providerEmail={product.providerEmail} />
        </div>
      </div>
    </div>
  );
}