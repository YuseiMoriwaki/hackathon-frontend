import { use } from 'react';
import { UserProfilePage } from '@/features/user';

export default function PublicUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <main className="flex-1">
      <UserProfilePage userId={id} canEdit={false} />
    </main>
  );
}

export const metadata = {
  title: 'ユーザープロフィール - フリマアプリ',
  description: 'ユーザーのプロフィール',
};

