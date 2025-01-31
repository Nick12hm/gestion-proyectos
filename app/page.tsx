'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = false; // Aquí iría la lógica para verificar si el usuario está autenticado

    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('auth/login');
    }
  }, [router]);

  return null; // No renderizar nada mientras se redirige
};

export default Home;