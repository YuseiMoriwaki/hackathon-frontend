'use client';

import { useState } from 'react';
import { Container } from '@/components/layouts';
import { Button, LoadingSpinner } from '@/components/ui';
import { UserProfile } from '../components/UserProfile';
import { ProfileEditForm } from '../components/ProfileEditForm';
import { useUser } from '../hooks/useUser';
import { useUpdateUser } from '../hooks/useUpdateUser';
import type { UserProfileUpdate } from '../types';

interface UserProfilePageProps {
  userId: string;
  canEdit?: boolean;
}

export function UserProfilePage({ userId, canEdit = false }: UserProfilePageProps) {
  const { user, isLoading } = useUser(userId);
  const { updateUser, isUpdating } = useUpdateUser(userId);
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = async (data: UserProfileUpdate) => {
    try {
      await updateUser(data);
      setIsEditing(false);
    } catch (error) {
      throw error;
    }
  };

  if (isLoading) {
    return (
      <Container className="py-8">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="py-8">
        <div className="text-center text-red-300">
          ユーザーが見つかりません
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6 pl-12 md:pl-0">
          <h1 className="text-3xl font-bold text-white">
            {isEditing ? 'プロフィール編集' : 'プロフィール'}
          </h1>
          {canEdit && !isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="primary">
              編集
            </Button>
          )}
          {canEdit && isEditing && (
            <Button onClick={() => setIsEditing(false)} variant="secondary">
              キャンセル
            </Button>
          )}
        </div>

        {isEditing ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <ProfileEditForm
              user={user}
              onSubmit={handleUpdate}
              isLoading={isUpdating}
            />
          </div>
        ) : (
          <UserProfile user={user} />
        )}
      </div>
    </Container>
  );
}

