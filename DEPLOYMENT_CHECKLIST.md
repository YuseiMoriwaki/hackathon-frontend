# リモートデプロイ前チェックリスト

## 🔴 必須（エラー修正）

### 1. Lintエラーの修正

現在、以下のエラーが残っています：

#### `src/app/api/ai_chat/stream/route.ts` (2箇所)
- **問題**: `any`型の使用
- **修正**: 型定義を追加

```typescript
// 修正前
.filter((msg: any) => ...)
.map((msg: any) => ...)

// 修正後
interface MessageInput {
  role: string;
  content: string;
}
.filter((msg: MessageInput) => ...)
.map((msg: MessageInput) => ...)
```

#### `src/components/layouts/BottomNav.tsx` (1箇所)
- **問題**: Effect内でのsetState
- **修正**: useState初期化関数を使用

```typescript
// 修正前
useEffect(() => {
  const currentIndex = navItems.findIndex(item => pathname === item.path);
  if (currentIndex !== -1) {
    setActiveIndex(currentIndex);
  }
}, [pathname]);

// 修正後
const getInitialIndex = () => {
  return navItems.findIndex(item => pathname === item.path);
};
const [activeIndex, setActiveIndex] = useState(getInitialIndex);

useEffect(() => {
  const currentIndex = navItems.findIndex(item => pathname === item.path);
  if (currentIndex !== -1 && currentIndex !== activeIndex) {
    setActiveIndex(currentIndex);
  }
}, [pathname, navItems, activeIndex]);
```

#### `src/components/ui/drawer.tsx` (2箇所)
- **問題**: Render中にrefを更新
- **修正**: useEffect内で更新

```typescript
// 修正前
handleMouseMoveRef.current = handleMouseMove;
handleMouseUpRef.current = handleMouseUp;

// 修正後
useEffect(() => {
  handleMouseMoveRef.current = handleMouseMove;
  handleMouseUpRef.current = handleMouseUp;
}, [handleMouseMove, handleMouseUp]);
```

### 2. Build確認

```bash
npm run build
```

✅ 既に成功していますが、エラー修正後は再確認してください。

## ⚠️ 推奨（警告修正）

### 1. 未使用変数の削除

- `src/app/(private)/home/page.tsx`: `user`変数
- `src/components/layouts/BottomNav.tsx`: `index`変数

### 2. 画像最適化

- `src/app/(private)/user/purchases/page.tsx`: `<img>`を`<Image />`に置換

### 3. useEffect依存配列

- `src/components/layouts/BottomNav.tsx`: `navItems`を依存配列に追加

## 📋 デプロイ前の実行コマンド

### 1. Lintチェック（エラー0にする）

```bash
npm run lint
```

**目標**: エラー0、警告は可能な限り削減

### 2. TypeScript型チェック

```bash
npm run build
```

**目標**: エラー0でビルド成功

### 3. 環境変数の確認

`.env.local`または`.env.production`に以下を設定：

```bash
# 本番環境のAPI URL
NEXT_PUBLIC_API_URL=https://your-production-api.com/api
NEXT_PUBLIC_API_BASE_URL=https://your-production-api.com
```

**注意**: `.env.local`は`.gitignore`に含まれているため、デプロイ先で別途設定が必要です。

### 4. ビルド成果物の確認

```bash
npm run build
ls -la .next/
```

**確認項目**:
- `.next/`ディレクトリが生成されている
- エラーなくビルドが完了している

## 🚀 デプロイ手順（Vercel例）

### 1. 環境変数の設定

Vercelダッシュボードで以下を設定：
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_API_BASE_URL`

### 2. ビルドコマンド

```bash
npm run build
```

### 3. 出力ディレクトリ

```
.next
```

### 4. インストールコマンド

```bash
npm install
```

## 📝 追加検討事項

### Prettierの設定（オプション）

現在、Prettierの設定ファイルがありません。コードフォーマットを統一する場合は追加を検討：

```bash
npm install --save-dev prettier
```

`.prettierrc`を作成：
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

`package.json`に追加：
```json
{
  "scripts": {
    "format": "prettier --write \"src/**/*.{ts,tsx}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx}\""
  }
}
```

## ✅ 最終チェックリスト

- [x] `npm run lint` でエラー0 ✅ **完了**
- [x] `npm run build` でエラー0 ✅ **完了**
- [ ] 環境変数が正しく設定されている
- [x] `.env.local`が`.gitignore`に含まれている（機密情報保護）✅ **確認済み**
- [ ] 本番環境のAPI URLが正しく設定されている
- [x] ビルド成果物が生成されている ✅ **確認済み**

## 📊 現在の状態

- **Lintエラー**: 0 ✅
- **Lint警告**: 2（非致命的）
- **Build**: 成功 ✅
- **TypeScript**: エラーなし ✅

## 🔍 トラブルシューティング

### Buildエラーが出る場合

1. TypeScriptエラーを確認
2. 依存関係を再インストール: `rm -rf node_modules && npm install`
3. `.next`をクリア: `rm -rf .next && npm run build`

### Lintエラーが出る場合

1. エラーメッセージを確認
2. 該当ファイルを修正
3. `npm run lint`で再確認

### 環境変数が反映されない場合

1. 変数名が`NEXT_PUBLIC_`で始まっているか確認
2. ビルド後に再起動
3. ブラウザのキャッシュをクリア

