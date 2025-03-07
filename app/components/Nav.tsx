'use client';
import Link from 'next/link';
import LogoutButton from './LogoutButton';
import { useSession } from './Session';

export default function Nav() {
  const { email } = useSession();

  return (
    <nav className="bg-white shadow-lg p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">NextShop</Link>
        {email ? (
          <>
            <span className="text-gray-700">Welcome, {email}</span>
            <LogoutButton />
          </>
        ) : (
          <Link href="/login" className="text-gray-700 hover:text-blue-500">Login</Link>
        )}
        <Link href="/products" className="text-gray-700 hover:text-blue-500">Products</Link>
        <Link href="/register" className="text-gray-700 hover:text-blue-500">Register</Link>
        <Link href="/cart" className="p-2 bg-blue-500 text-white rounded">Cart</Link>
      </div>
    </nav>
  );
}