'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { GlassButton } from '@/components/ui';
import { UserProfilePage } from '@/features/user';
import { useAuth } from '@/features/auth';

export default function UserPage() {
  const router = useRouter();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      <div className="fixed top-20 left-4 z-40">
        <GlassButton onClick={() => router.back()} ariaLabel="戻る">
          <ArrowLeft className="w-5 h-5 text-white" />
        </GlassButton>
      </div>
      <main className="flex-1 pt-20 pb-24">
        <UserProfilePage userId={user.id} canEdit={true} />
      </main>
    </>
  );
}

