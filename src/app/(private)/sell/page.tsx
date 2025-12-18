import { ItemFormPage } from '@/features/items';

export default function SellPage() {
  return (
    <main className="flex-1 pt-14 pb-24">
      <ItemFormPage />
    </main>
  );
}

export const metadata = {
  title: '商品を出品 - フリマアプリ',
  description: '新しい商品を出品',
};

