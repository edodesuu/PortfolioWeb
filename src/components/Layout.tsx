import { type ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="relative min-h-screen bg-black">
      {/* Main content */}
      <main className="relative">
        {children}
      </main>
    </div>
  );
}
