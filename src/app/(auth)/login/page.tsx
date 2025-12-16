import { LoginForm } from '@/features/auth';

export default function LoginPage() {
  return (
    <div className="w-full max-w-md glass-card p-8">
      <LoginForm />
    </div>
  );
}

export const metadata = {
  title: 'ログイン - フリマアプリ',
  description: 'ログインページ',
};

