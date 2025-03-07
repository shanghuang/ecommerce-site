'use client';

import { useRouter } from 'next/navigation';
import { useSession } from './Session';

export default function LogoutButton() {
  const router = useRouter();
  const { setSessionEmail } = useSession();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      //localStorage.removeItem('email');
      localStorage.setItem('email', "");
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
      Logout
    </button>
  );
}