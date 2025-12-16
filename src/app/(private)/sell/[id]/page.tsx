import { use } from 'react';
import { ItemFormPage } from '@/features/items';
import { Header } from '@/components/layouts';

export default function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ItemFormPage itemId={id} />
      </main>
    </div>
  );
}

export const metadata = {
  title: '商品を編集 - フリマアプリ',
  description: '商品情報を編集',
};

