import { use } from 'react';
import { ItemFormPage } from '@/features/items';

export default function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <main className="flex-1">
      <ItemFormPage itemId={id} />
    </main>
  );
}

export const metadata = {
  title: '商品を編集 - フリマアプリ',
  description: '商品情報を編集',
};
