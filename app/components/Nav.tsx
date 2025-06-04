'use client';
import Link from 'next/link';
import LogoutButton from './LogoutButton';
import { useSession } from './Session';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function Nav() {
  const { email } = useSession();
  const t = useTranslations('Nav');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-white shadow-lg p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">NextShop</Link>
        {email ? (
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="text-gray-700 hover:text-blue-500 focus:outline-none"
            >
              {t("welcome")}, {email}
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                <Link href="/account/products" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  {t("products")}
                </Link>
                <Link href="/account/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  {t("history")}
                </Link>
                <Link href="/provider/chat" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Provider Chat
                </Link>
                <Link href="/unregister" className="text-gray-700 hover:text-blue-500">{t("unregister")}</Link>
              </div>
            )}
            <LogoutButton />
          </div>
        ) : (
          <Link href="/login" className="text-gray-700 hover:text-blue-500">{t("login")}</Link>
        )}
        <Link href="/products" className="text-gray-700 hover:text-blue-500">{t("products")}</Link>
        <Link href="/register" className="text-gray-700 hover:text-blue-500">{t("register")}</Link>
        <Link href="/cart" className="p-2 bg-blue-500 text-white rounded">{t("cart")}</Link>
      </div>
    </nav>
  );
}