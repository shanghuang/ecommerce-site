'use client';
import { createContext, useContext, useEffect, useState } from 'react';

type SessionContextType = {
  email: string;
  setSessionEmail: (email: string) => void;
};

const SessionContext = createContext<SessionContextType>({
  email: '',
  setSessionEmail: () => {},
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Initialize email from localStorage
    const storedEmail = localStorage.getItem('email') || '';
    setEmail(storedEmail);
  }, []);

  return (
    <SessionContext.Provider value={{ email, setSessionEmail: setEmail }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}