'use client';

import { Header, Container } from '@/components/layouts';
import { Card, LoadingSpinner } from '@/components/ui';
import { useAuth } from '@/features/auth';
import { usePurchaseHistory } from '@/features/purchase';
import Link from 'next/link';

export default function PurchasesPage() {
  const { user } = useAuth();
  const { purchases, isLoading, isError } = usePurchaseHistory(user?.id || '');

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-14 pb-24">
        <Container className="py-8">
          <h1 className="text-3xl font-bold text-white mb-8">購入履歴</h1>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : isError ? (
            <div className="text-center text-red-300">
              購入履歴の読み込みに失敗しました
            </div>
          ) : purchases && purchases.length > 0 ? (
            <div className="space-y-4">
              {purchases.map(purchase => (
                <Link key={purchase.id} href={`/items/${purchase.itemId}`}>
                  <Card hover variant="glass">
                    <div className="flex gap-4">
                      <img
                        src={purchase.itemImage}
                        alt={purchase.itemTitle}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1 text-white">
                          {purchase.itemTitle}
                        </h3>
                        <p className="text-2xl font-bold text-blue-300 mb-2">
                          ¥{purchase.itemPrice.toLocaleString()}
                        </p>
                        <p className="text-sm text-white/50">
                          購入日: {new Date(purchase.createdAt).toLocaleDateString('ja-JP')}
                        </p>
                        <span className={`glass-badge inline-block mt-2 border ${
                          purchase.status === 'completed'
                            ? 'bg-green-500/20 text-green-300 border-green-500/30'
                            : 'bg-white/10 text-white/70 border-white/20'
                        }`}>
                          {purchase.status === 'completed' ? '完了' : purchase.status}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center text-white/50 py-16">
              購入履歴はありません
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}
