'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { useRegister } from '../hooks/useRegister';

export function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const { register, isLoading } = useRegister();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください');
      return;
    }

    try {
      await register({ name, email, password });
      router.push('/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : '登録に失敗しました');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">新規登録</h2>
        <p className="text-white/70">アカウントを作成してください</p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg backdrop-blur-sm">
          {error}
        </div>
      )}

      <Input
        type="text"
        label="お名前"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        placeholder="山田太郎"
      />

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
        placeholder="6文字以上"
        helperText="6文字以上で入力してください"
      />

      <Input
        type="password"
        label="パスワード（確認）"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        required
        placeholder="パスワードを再入力"
      />

      <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
        登録
      </Button>

      <div className="text-center">
        <a href="/login" className="text-blue-300 hover:text-blue-200 text-sm transition-colors">
          既にアカウントをお持ちの方はこちら
        </a>
      </div>
    </form>
  );
}
