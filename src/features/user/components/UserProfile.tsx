'use client';

import { Card } from '@/components/ui';
import type { UserProfile } from '../types';

interface UserProfileProps {
  user: UserProfile;
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <Card>
      <div className="flex items-start gap-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center text-white text-3xl font-bold backdrop-blur-sm border border-white/10">
          {user.name[0]}
        </div>
        
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-2">
            {user.name}
          </h2>
          
          {user.location && (
            <p className="text-white/70 mb-2">
              📍 {user.location}
            </p>
          )}
          
          {user.bio && (
            <p className="text-white/80 mb-4">
              {user.bio}
            </p>
          )}
          
          <div className="flex gap-6 text-sm">
            <div>
              <span className="font-semibold text-white">{user.itemsCount || 0}</span>
              <span className="text-white/70"> 出品</span>
            </div>
            <div>
              <span className="font-semibold text-white">{user.purchasesCount || 0}</span>
              <span className="text-white/70"> 購入</span>
            </div>
            <div className="text-white/40">
              登録日: {new Date(user.createdAt).toLocaleDateString('ja-JP')}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
