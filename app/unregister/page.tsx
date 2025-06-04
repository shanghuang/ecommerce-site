// app/unregister/page.tsx
'use client';

import { useState } from 'react';
import { useRouter} from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useSession } from '../components/Session';
import Link from 'next/link';

export default function UnregisterPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations('Unregister');
  const { setSessionEmail } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors('');
    setIsSubmitting(true);

    console.log("Submitting unregister form with password:", password);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not authenticated');
      }
      console.log("Unregistering user with token:", token);
      const response = await fetch('/api/unregister', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });
      console.log("Response status:", response.status);
      if (response.ok) {
        await fetch('/api/auth/logout', {
          method: 'POST',
        });
        //localStorage.removeItem('email');
        localStorage.setItem('email', "");
        localStorage.setItem('token', "");
        setSessionEmail('');
        console.log("User unregistered successfully, redirecting to home page");
        router.push('/'); // Redirect after successful deletion
      } else {
        const errorData = await response.json();
        setErrors(errorData.message || t('unregisterFailed'));
      }
    } catch (error) {
      setErrors('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">{t('deleteAccount')}</h1>
      {errors && (
        <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
          {errors}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="block mb-1 text-gray-900">
            {t('confirmPassword')}
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded text-gray-900"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 disabled:bg-red-300"
        >
          {isSubmitting ? t('deleting') + '...' : t('deleteAccount')}
        </button>
      </form>
      <div className="mt-4 text-center">
        <p className="text-gray-600">
          {t('areYouSure?')}{' '}
          <Link href="/" className="text-blue-500 hover:underline">
            {t('cancel')}
          </Link>
        </p>
      </div>
    </div>
  );
}