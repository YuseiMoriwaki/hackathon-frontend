import { Header } from '@/components/layouts';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {children}
    </div>
  );
}
