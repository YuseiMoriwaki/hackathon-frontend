'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function UserProfilePage() {
  useEffect(() => {
    redirect('/user');
  }, []);

  return null;
}

