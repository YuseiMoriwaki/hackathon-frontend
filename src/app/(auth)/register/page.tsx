import { RegisterForm } from '@/features/auth';

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md glass-card p-8">
      <RegisterForm />
    </div>
  );
}

export const metadata = {
  title: '新規登録 - フリマアプリ',
  description: '新規登録ページ',
};

