'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ForgotPassword from '@/components/Auth/ForgotPassword';

export default function ForgotPage() {
  const router = useRouter();

  return (
    <ForgotPassword 
      onNavigate={(page) => router.push(`/${page}`)} 
    />
  );
}
