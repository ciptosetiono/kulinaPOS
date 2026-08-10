'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Login from '@/components/Auth/Login';

export default function ForgotPage() {
  const router = useRouter();

  return (
    <Login 
      onLogin={() => router.push('/dashboard')} 
      onNavigate={(page) => router.push(`/${page}`)} 
    />
  );
}
