import { use } from 'react';
import { Header } from '@/components/layouts';
import { UserProfilePage } from '@/features/user';

export default function PublicUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <UserProfilePage userId={id} canEdit={false} />
      </main>
    </div>
  );
}

export const metadata = {
  title: 'ユーザープロフィール - フリマアプリ',
  description: 'ユーザーのプロフィール',
};

