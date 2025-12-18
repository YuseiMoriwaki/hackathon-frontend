'use client';

import { UserListingsPage } from '@/features/user';
import { useAuth } from '@/features/auth';

export default function ListingsPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <main className="flex-1 pt-14 pb-24">
      <UserListingsPage userId={user.id} />
    </main>
  );
}
