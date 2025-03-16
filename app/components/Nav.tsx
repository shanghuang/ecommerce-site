'use client';
import Link from 'next/link';
import LogoutButton from './LogoutButton';
import { useSession } from './Session';
import { useTranslations } from 'next-intl';

export default function Nav() {
  const { email } = useSession();
  const t = useTranslations('Nav');

  return (
    <nav className="bg-white shadow-lg p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">NextShop</Link>
        {email ? (
          <>
            <span className="text-gray-700">{t("welcome")}, {email}</span>
            <LogoutButton />
          </>
        ) : (
          <Link href="/login" className="text-gray-700 hover:text-blue-500">{t("login")}</Link>
        )}
        <Link href="/products" className="text-gray-700 hover:text-blue-500">{t("products")}</Link>
        <Link href="/register" className="text-gray-700 hover:text-blue-500">{t("register")}</Link>
        <Link href="/account/orders" className="text-gray-700 hover:text-blue-500">{t("history")}</Link>
        <Link href="/cart" className="p-2 bg-blue-500 text-white rounded">{t("cart")}</Link>
      </div>
    </nav>
  );
}