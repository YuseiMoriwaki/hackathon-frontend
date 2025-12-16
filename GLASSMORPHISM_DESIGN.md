# Glassmorphism デザインシステム実装完了

## 概要
フリマアプリ全体にダークモードのGlassmorphismデザインシステムを適用しました。

## 実装された変更

### 1. グローバルスタイル (`globals.css`)
- 背景色を `#0a0a0a` に変更
- テキストデフォルトカラーを `#ededed` に設定
- カスタムGlassクラスを定義:
  - `.glass-card` - 標準カード
  - `.glass-card-special` - 特別なカード
  - `.glass-button` - ボタン
  - `.glass-input` - 入力欄
  - `.glass-badge` - バッジ
  - `.glass-overlay` - オーバーレイ

### 2. Root Layout (`layout.tsx`)
- `<html>` に `dark` クラスを追加
- `<body>` に背景色 `bg-[#0a0a0a]` と テキストカラー `text-[#ededed]` を適用

### 3. 共通UIコンポーネント

#### Button
- 角丸を `rounded-3xl` に変更
- ホバー時に `scale-[1.01]` アニメーション追加
- variant別にGlassmorphismスタイル適用:
  - primary: `bg-blue-500/20 text-blue-300 border-blue-500/30`
  - secondary: `bg-white/10 text-white border-white/10`
  - danger: `bg-red-500/20 text-red-300 border-red-500/30`
  - outline: `border-white/20 text-white/70`

#### Input & Textarea
- `glass-input` クラス使用
- プレースホルダーを `text-white/50` に
- フォーカス時に `ring-white/30` 表示

#### Card
- 2つのvariantを追加:
  - default: `glass-card` (標準)
  - glass: `glass-card-special` (特別)
- ホバー時の複合シャドウアニメーション追加
- テキストカラーを白階層に変更

#### Modal
- 背景を `bg-neutral-900` に
- オーバーレイを `bg-black/80` with `backdrop-blur`
- 複合シャドウ適用

#### LoadingSpinner
- カラーを `text-blue-300` に変更

### 4. レイアウトコンポーネント

#### Header
- `bg-white/5 backdrop-blur-xl` 適用
- ボーダーを `border-white/10` に
- ナビゲーションリンクのカラーを白階層に
- ロゴを `text-purple-400` に

#### Footer
- `bg-white/5 backdrop-blur-xl` 適用
- すべてのテキストを白階層に変更

#### Container
- レスポンシブパディング `px-4 md:px-6` 適用

### 5. 認証関連コンポーネント

#### LoginForm & RegisterForm
- エラーメッセージ: `bg-red-500/20 text-red-300 border-red-500/30`
- 情報メッセージ: `bg-blue-500/20 text-blue-300 border-blue-500/30`
- すべてのテキストを白階層に

#### Auth Pages
- ページラッパーを `glass-card` に変更

### 6. 商品関連コンポーネント

#### ItemCard
- `variant="glass"` 使用
- ステータスバッジを `glass-badge` に
- 価格を `text-blue-300` に
- ホバーアニメーション追加

#### ItemDetail
- すべてのテキストを白階層に
- カテゴリ情報カードを `glass-card` に
- ステータスバッジを適切な色で表示:
  - available: `bg-green-500/20 text-green-300 border-green-500/30`

#### ItemForm
- フォーム全体をGlassmorphism化
- セレクトボックスに `glass-input` 適用
- 画像プレビューに border と適切な角丸

#### SearchFilters
- フィルターパネルを `glass-card` に
- すべての入力欄を統一スタイルに

### 7. 購入関連コンポーネント

#### PurchaseModal
- 各ステップをGlassmorphism化
- ラジオボタンの選択肢を `glass-card` に
- ホバー時に `bg-white/10` 効果

### 8. ユーザー関連コンポーネント

#### UserProfile
- プロフィールカードを `glass-card` に
- アバターにグラデーション背景と `backdrop-blur`
- 統計情報を白階層テキストで表示

#### ProfileEditForm
- フォーム全体をGlassmorphism化

#### 購入履歴ページ
- 履歴カードを `glass-card` に
- ステータスバッジを適切な色で表示

### 9. ページレベルコンポーネント

#### Home (Dashboard)
- カードを `variant="glass"` に変更
- すべてのテキストを白階層に

#### ItemListPage
- タイトルと説明を白階層に

#### ItemFormPage
- フォームラッパーを `glass-card` に

## カラー階層

### テキスト
- 見出し: `text-white`
- 説明: `text-white/70`
- 補助情報: `text-white/50`
- タイムスタンプ: `text-white/40`

### アクセント
- 青 (プライマリ): `text-blue-300`, `bg-blue-500/20`
- 紫 (特別): `text-purple-400`
- 緑 (成功): `text-green-300`, `bg-green-500/20`
- 赤 (エラー): `text-red-300`, `bg-red-500/20`

## 複合シャドウパターン

標準: `box-shadow: 0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.12);`

ホバー: `box-shadow: 0 12px 40px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.16);`

## アニメーション

- すべてのトランジション: `transition-all duration-300`
- ホバー時のスケール: `hover:scale-[1.01]` または `hover:scale-[1.02]`

## 角丸の統一

- カード: `rounded-xl` または `rounded-[20px]`
- ボタン: `rounded-3xl`
- バッジ: `rounded-full`
- 入力欄: `rounded-lg`
- 画像: `rounded-lg`

## 結果

全てのコンポーネントとページが統一されたGlassmorphismデザインシステムに準拠し、ダークモードで視覚的に一貫性のある美しいUIを実現しました。

開発サーバー（http://localhost:3000）で確認可能です。

