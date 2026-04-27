import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Compass } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { PortfolioChart } from '../components/charts/PortfolioChart';
import { AssetRow } from '../components/project/AssetRow';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ChangeBadge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { SkeletonCard, SkeletonRow } from '../components/ui/Skeleton';
import { useWalletStore } from '../stores/wallet.store';
import { usePortfolioHistory } from '../hooks/usePriceHistory';
import { filterPortfolioHistory } from '../utils/period';
import { formatCurrency } from '../utils/format';
import { PERIODS } from '../constants';
import type { Period } from '../types';

function PeriodSelector({
  value,
  onChange,
}: {
  value: Period;
  onChange: (p: Period) => void;
}) {
  return (
    <div className="flex gap-1">
      {PERIODS.map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={[
            'px-3 py-1 rounded-tag text-xs font-medium transition-all duration-150',
            value === p
              ? 'bg-violet-600 text-white'
              : 'text-gray-400 hover:text-ink hover:bg-card',
          ].join(' ')}
        >
          {p}
        </button>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<Period>('1M');
  const { availableBalance, totalInvested, assets, loading } = useWalletStore();
  const { data: portfolioHistory, loading: chartLoading } = usePortfolioHistory(period);

  const total = availableBalance + totalInvested;
  const lastTwo = portfolioHistory.slice(-2);
  const change24h =
    lastTwo.length === 2
      ? ((lastTwo[1].value - lastTwo[0].value) / lastTwo[0].value) * 100
      : 0;

  return (
    <AppLayout>
      <section className="mb-8">
        {loading ? (
          <SkeletonCard />
        ) : (
          <>
            <p className="text-sm text-gray-400 font-medium mb-1">Patrimônio Total</p>
            <h1 className="font-display font-bold text-5xl text-ink tracking-tight mb-2">
              {formatCurrency(total)}
            </h1>
            <div className="flex items-center gap-3 mb-6">
              <ChangeBadge value={change24h} />
              <span className="text-sm text-gray-400">últimas 24h</span>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => navigate('/depositar')}>Depositar</Button>
              <Button variant="secondary" onClick={() => navigate('/explorar')}>
                <Compass size={16} />
                Explorar Projetos
              </Button>
            </div>
          </>
        )}
      </section>

      <section className="mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-ink">Portfólio</h2>
            <PeriodSelector value={period} onChange={setPeriod} />
          </div>
          {chartLoading ? (
            <div className="h-[220px] animate-pulse bg-card rounded-input" />
          ) : (
            <PortfolioChart data={portfolioHistory} />
          )}
        </Card>
      </section>

      <section>
        <h2 className="font-display font-bold text-ink mb-4">Meus Ativos</h2>
        <Card>
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
          ) : assets.length === 0 ? (
            <EmptyState
              icon={<Wallet size={24} />}
              title="Nenhum ativo ainda"
              description="Explore projetos e compre seus primeiros tokens."
              action={
                <Button onClick={() => navigate('/explorar')}>
                  Explorar Projetos
                </Button>
              }
            />
          ) : (
            assets.map(asset => <AssetRow key={asset.ticker} asset={asset} />)
          )}
        </Card>
      </section>
    </AppLayout>
  );
}
