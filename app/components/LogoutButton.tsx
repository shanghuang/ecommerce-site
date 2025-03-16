'use client';

import { useRouter } from 'next/navigation';
import { useSession } from './Session';
import { useTranslations } from 'next-intl';

export default function LogoutButton() {
  const router = useRouter();
  const { setSessionEmail } = useSession();
  const t = useTranslations('Nav');

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      //localStorage.removeItem('email');
      localStorage.setItem('email', "");
      localStorage.setItem('token', "");
      setSessionEmail('');
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="text-gray-700 hover:text-blue-500"
    >
      {t("logout")}
    </button>
  );
}