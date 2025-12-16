'use client';

import { Header } from '@/components/layouts';
import { UserListingsPage } from '@/features/user';
import { useAuth } from '@/features/auth';

export default function UserItemsPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-14 pb-24">
        <UserListingsPage userId={user.id} />
      </main>
    </div>
  );
}

