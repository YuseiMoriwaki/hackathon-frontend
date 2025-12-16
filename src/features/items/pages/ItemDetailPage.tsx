'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/layouts';
import { LoadingSpinner, Button } from '@/components/ui';
import { ItemDetail } from '../components/ItemDetail';
import { useItem } from '../hooks/useItem';
import { useDeleteItem } from '../hooks/useDeleteItem';
import { useAuth } from '@/features/auth';

interface ItemDetailPageProps {
  itemId: string;
  onPurchaseClick?: () => void;
}

export function ItemDetailPage({ itemId, onPurchaseClick }: ItemDetailPageProps) {
  const { item, isLoading, isError } = useItem(itemId);
  const { deleteItem, isDeleting } = useDeleteItem();
  const { user } = useAuth();
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const canEdit = user && item && user.id === item.sellerId;

  const handleDelete = async () => {
    if (!item) return;
    
    try {
      await deleteItem(item.id);
      router.push('/user/listings');
    } catch (error) {
      alert('削除に失敗しました');
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

  if (isError || !item) {
    return (
      <Container className="py-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">商品が見つかりません</p>
          <Button onClick={() => router.push('/items')}>
            商品一覧に戻る
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <ItemDetail
        item={item}
        onPurchaseClick={onPurchaseClick}
        canEdit={canEdit}
        onEditClick={() => router.push(`/sell/${item.id}`)}
        onDeleteClick={() => setShowDeleteConfirm(true)}
      />

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">削除の確認</h3>
            <p className="text-gray-600 mb-6">
              本当にこの商品を削除しますか？この操作は取り消せません。
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                variant="secondary"
                className="flex-1"
                disabled={isDeleting}
              >
                キャンセル
              </Button>
              <Button
                onClick={handleDelete}
                variant="danger"
                className="flex-1"
                isLoading={isDeleting}
              >
                削除する
              </Button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}

