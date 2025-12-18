'use client';

import { useState } from 'react';
import { Button, Input, Textarea } from '@/components/ui';
import type { UserProfile, UserProfileUpdate } from '../types';

interface ProfileEditFormProps {
  user: UserProfile;
  onSubmit: (data: UserProfileUpdate) => Promise<void>;
  isLoading?: boolean;
}

export function ProfileEditForm({ user, onSubmit, isLoading }: ProfileEditFormProps) {
  const [formData, setFormData] = useState<UserProfileUpdate>({
    name: user.name,
    bio: user.bio || '',
    location: user.location || '',
    avatar: user.avatar || '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name) {
      setError('名前は必須です');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新に失敗しました');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg backdrop-blur-sm">
          {error}
        </div>
      )}

      <Input
        label="名前"
        value={formData.name}
        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
        required
      />

      <Input
        label="居住地"
        value={formData.location}
        onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
        placeholder="東京都"
      />

      <Textarea
        label="自己紹介"
        value={formData.bio}
        onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
        rows={4}
        placeholder="自己紹介を入力してください"
      />

      <Input
        label="アバター画像URL"
        value={formData.avatar}
        onChange={e => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
        placeholder="https://example.com/avatar.jpg"
      />

      <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
        更新する
      </Button>
    </form>
  );
}
