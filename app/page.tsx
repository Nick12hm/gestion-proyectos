'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Se valida login para saber a donde dirigir al usuario
 * @returns Página para usuario según login
 */
const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = false;
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('auth/login');
    }
  }, [router]);

  return null; // No renderizar nada mientras se redirige
};

export default Home;