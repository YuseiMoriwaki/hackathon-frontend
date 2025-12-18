import type { ItemCategory, ItemStatus } from '../types';

export const ITEM_CATEGORIES: { value: ItemCategory; label: string }[] = [
  { value: 'fashion', label: 'ファッション' },
  { value: 'electronics', label: '家電・スマホ' },
  { value: 'books', label: '本・音楽' },
  { value: 'sports', label: 'スポーツ' },
  { value: 'home', label: '生活用品' },
  { value: 'other', label: 'その他' },
];

export const STATUS_LABELS: Record<ItemStatus, string> = {
  active: '販売中',
  available: '販売中',
  sold: '売却済み',
  removed: '削除済み',
  reserved: '予約中',
};
