'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import EmailVerification from '@/components/Auth/EmailVerification';

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  return (
    <EmailVerification 
      email={email}
      onNavigate={(page) => router.push(`/${page}`)} 
    />
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white font-bold">
        Loading...
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
