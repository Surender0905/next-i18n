'use client';
import { session } from '@/utils/sessions';
import { useRouter } from 'next/navigation';
import { useLayoutEffect } from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  useLayoutEffect(() => {
    if (!session) {
      return router.push('/en/login');
    }
    router.push('/en/dashboard');
  }, []);

  return <div>{children}</div>;
};

export default AuthLayout;
