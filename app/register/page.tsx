'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Register from '@/components/Auth/Register';

export default function RegisterPage() {
  const router = useRouter();

  return (
    <Register 
      onNavigate={(page) => router.push(`/${page}`)} 
    />
  );
}
