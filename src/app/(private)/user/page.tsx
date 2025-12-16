'use client';

import { Header } from '@/components/layouts';
import { UserProfilePage } from '@/features/user';
import { useAuth } from '@/features/auth';

export default function UserPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <UserProfilePage userId={user.id} canEdit={true} />
      </main>
    </div>
  );
}

