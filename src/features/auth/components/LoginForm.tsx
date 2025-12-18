'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { useLogin } from '../hooks/useLogin';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login, isLoading } = useLogin();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login({ email, password });
      router.push('/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ログインに失敗しました');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">ログイン</h2>
        <p className="text-white/70">アカウントにログインしてください</p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg backdrop-blur-sm">
          {error}
        </div>
      )}

      <div className="bg-blue-500/20 border border-blue-500/30 text-blue-300 px-4 py-3 rounded-lg text-sm backdrop-blur-sm">
        <p className="font-semibold mb-1">テスト用アカウント:</p>
        <p className="text-blue-200/80">Email: test@example.com</p>
        <p className="text-blue-200/80">Password: password</p>
      </div>

      <Input
        type="email"
        label="メールアドレス"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        placeholder="example@email.com"
      />

      <Input
        type="password"
        label="パスワード"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        placeholder="パスワードを入力"
      />

      <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
        ログイン
      </Button>

      <div className="text-center">
        <a href="/register" className="text-blue-300 hover:text-blue-200 text-sm transition-colors">
          アカウントをお持ちでない方はこちら
        </a>
      </div>
    </form>
  );
}
