import { Menu } from 'lucide-react';
import { useWalletStore } from '../../stores/wallet.store';
import { useUiStore } from '../../stores/ui.store';
import { formatCurrency } from '../../utils/format';

export function Topbar() {
  const { availableBalance, totalInvested } = useWalletStore();
  const { toggleSidebar } = useUiStore();
  const total = availableBalance + totalInvested;

  return (
    <header className="fixed top-0 left-0 lg:left-60 right-0 h-14 bg-white border-b border-card-border flex items-center px-6 gap-4 z-30">
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-1 rounded-input hover:bg-card transition-all duration-150"
      >
        <Menu size={20} className="text-gray-600" />
      </button>

      <div className="flex-1" />

      <div className="hidden sm:flex items-center gap-1 bg-card rounded-input px-3 py-1.5 border border-card-border">
        <span className="text-xs text-gray-400 font-medium">Saldo total</span>
        <span className="font-mono text-sm font-medium text-ink">{formatCurrency(total)}</span>
      </div>

      <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-sm">
        B
      </div>
    </header>
  );
}
