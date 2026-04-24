import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { BottomNav } from './BottomNav';
import { useUiStore } from '../../stores/ui.store';
import { useWallet } from '../../hooks/useWallet';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  useWallet();
  const { sidebarOpen, setSidebarOpen } = useUiStore();

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-ink/30 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {sidebarOpen && (
        <div className="fixed left-0 top-0 h-full z-40 lg:hidden">
          <Sidebar />
        </div>
      )}

      <Topbar />

      <main className="lg:ml-60 pt-14 pb-20 lg:pb-0 min-h-screen">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
          {children}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
