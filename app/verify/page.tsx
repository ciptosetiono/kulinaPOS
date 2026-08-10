'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import EmailVerification from '@/components/Auth/EmailVerification';

export default function VerifyPage() {
  const router = useRouter();

  return (
    <EmailVerification 
      onNavigate={(page) => router.push(`/${page}`)} 
    />
  );
}
