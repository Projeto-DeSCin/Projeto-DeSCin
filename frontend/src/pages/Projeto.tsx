import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { PriceChart } from '../components/charts/PriceChart';
import { DonutChart } from '../components/charts/DonutChart';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { TickerLabel } from '../components/ui/TickerLabel';
import { ChangeBadge } from '../components/ui/Badge';
import { ConfirmModal } from '../components/ui/Modal';
import { Skeleton } from '../components/ui/Skeleton';
import { useProject } from '../hooks/useProject';
import { usePriceHistory } from '../hooks/usePriceHistory';
import { useWalletStore } from '../stores/wallet.store';
import { transactionsService } from '../services/transactions';
import { formatCurrency, formatNumber, formatDateTime, truncateHash } from '../utils/format';
import { getTickerColor } from '../utils/color';
import { PROJECT_PERIODS } from '../constants';
import type { Period } from '../types';

type Tab = 'sobre' | 'tokenomics' | 'transacoes';

function PeriodBtn({ value, active, onClick }: { value: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={[
        'px-3 py-1 rounded-tag text-xs font-medium transition-all duration-150',
        active ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-ink hover:bg-card',
      ].join(' ')}
    >
      {value}
    </button>
  );
}

export default function Projeto() {
  const { ticker: code } = useParams<{ ticker: string }>();
  const navigate = useNavigate();
  const fullTicker = code ? `PROJ:${code}` : undefined;

  const { project, loading } = useProject(fullTicker);
  const [period, setPeriod] = useState<Period>('1M');
  const { data: priceHistory, loading: chartLoading } = usePriceHistory(fullTicker, period);

  const [tab, setTab] = useState<Tab>('sobre');
  const [quantity, setQuantity] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [buying, setBuying] = useState(false);
  const [bought, setBought] = useState(false);

  const { availableBalance, optimisticBuy } = useWalletStore();

  const qty = parseInt(quantity, 10) || 0;
  const total = project ? qty * project.currentPrice : 0;
  const canBuy = qty > 0 && total <= availableBalance && !bought;

  const handleBuy = async () => {
    if (!project) return;
    setBuying(true);
    try {
      await transactionsService.buy({ ticker: project.ticker, amount: qty });
      optimisticBuy(project.ticker, project.name, qty, total);
      setModalOpen(false);
      setBought(true);
      setQuantity('');
    } finally {
      setBuying(false);
    }
  };

  const color = project ? getTickerColor(project.ticker) : '#7C3AED';

  if (!loading && !project) {
    return (
      <AppLayout>
        <div className="text-center py-24">
          <h2 className="font-display font-bold text-2xl text-ink mb-2">Projeto não encontrado</h2>
          <Button variant="ghost" onClick={() => navigate('/explorar')}>
            Voltar ao marketplace
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <button
        onClick={() => navigate('/explorar')}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-ink mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Voltar ao marketplace
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-9 w-2/3" />
                <Skeleton className="h-5 w-1/4" />
              </div>
            ) : project && (
              <>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <TickerLabel ticker={project.ticker} size="md" className="mb-2" />
                    <h1 className="font-display font-bold text-2xl text-ink leading-tight mb-1">
                      {project.name}
                    </h1>
                    <p className="text-sm text-gray-400">{project.university} · {project.area}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-mono font-bold text-2xl text-ink">
                      {formatCurrency(project.currentPrice)}
                    </p>
                    <ChangeBadge value={project.change24h} />
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-1 mb-4">
              {PROJECT_PERIODS.map(p => (
                <PeriodBtn key={p} value={p} active={period === p} onClick={() => setPeriod(p)} />
              ))}
            </div>

            {chartLoading || !project ? (
              <div className="h-[240px] animate-pulse bg-card rounded-input" />
            ) : (
              <PriceChart data={priceHistory} change24h={project.change24h} />
            )}
          </Card>

          <Card>
            <div className="flex border-b border-card-border">
              {(['sobre', 'tokenomics', 'transacoes'] as Tab[]).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={[
                    'flex-1 py-3 text-sm font-medium capitalize transition-all duration-150',
                    tab === t
                      ? 'text-violet-600 border-b-2 border-violet-600 -mb-px'
                      : 'text-gray-400 hover:text-ink',
                  ].join(' ')}
                >
                  {t === 'transacoes' ? 'Transações' : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            <div className="p-6">
              {tab === 'sobre' && project && (
                <div className="space-y-6">
                  <p className="text-sm text-gray-600 leading-relaxed">{project.description}</p>
                  <div>
                    <h3 className="font-display font-bold text-ink mb-3">Equipe</h3>
                    <div className="space-y-3">
                      {project.team.map((member, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{ background: color }}
                          >
                            {member.name.split(' ').pop()?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-ink">{member.name}</p>
                            <p className="text-xs text-gray-400">{member.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {tab === 'tokenomics' && project && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Supply Total', value: formatNumber(project.totalSupply) },
                      { label: 'Disponíveis', value: formatNumber(project.availableTokens) },
                      { label: 'Em Circulação', value: formatNumber(project.totalSupply - project.availableTokens) },
                    ].map(stat => (
                      <div key={stat.label} className="bg-surface rounded-input p-3">
                        <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
                        <p className="font-mono font-bold text-ink">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                  <DonutChart
                    data={[
                      { label: 'Em Circulação', value: project.totalSupply - project.availableTokens, color: color },
                      { label: 'Disponíveis', value: project.availableTokens, color: '#E5E1F8' },
                    ]}
                  />
                </div>
              )}

              {tab === 'transacoes' && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 mb-3">Últimas transações públicas deste token</p>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 border-b border-card-border last:border-b-0 text-xs gap-3">
                      <span className="font-mono text-gray-400 truncate" title={`0x${i}abc...`}>
                        {truncateHash(`0x${i.toString().padStart(2, '0')}abc4f${i}de8`)}
                      </span>
                      <span className="text-gray-600 font-medium flex-shrink-0">
                        +{(10 + i * 7)} tokens
                      </span>
                      <span className="text-gray-400 flex-shrink-0">
                        {formatDateTime(new Date(Date.now() - i * 3_600_000 * (i + 1)).toISOString())}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5 sticky top-20">
            {bought ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                  <ShoppingCart size={20} className="text-success" />
                </div>
                <h3 className="font-display font-bold text-ink mb-1">Compra realizada!</h3>
                <p className="text-sm text-gray-400 mb-4">Tokens adicionados à sua carteira.</p>
                <Button variant="secondary" size="sm" className="w-full" onClick={() => setBought(false)}>
                  Comprar mais
                </Button>
              </div>
            ) : (
              <>
                <h3 className="font-display font-bold text-ink mb-4">Comprar Tokens</h3>
                {loading || !project ? (
                  <div className="space-y-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <label className="text-sm font-medium text-gray-700 block mb-1.5">
                        Quantidade de tokens
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                        placeholder="0"
                        className="w-full border border-card-border rounded-input bg-white px-3 py-2.5 text-sm font-mono text-ink placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-150"
                      />
                    </div>

                    <div className="space-y-2 mb-4 p-3 bg-surface rounded-input">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Preço unitário</span>
                        <span className="font-mono text-ink">{formatCurrency(project.currentPrice)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Quantidade</span>
                        <span className="font-mono text-ink">{qty}</span>
                      </div>
                      <div className="border-t border-card-border pt-2 flex justify-between text-sm font-medium">
                        <span className="text-gray-600">Total</span>
                        <span className="font-mono text-ink">{formatCurrency(total)}</span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-400 mb-4">
                      Saldo disponível:{' '}
                      <span className="font-mono text-ink">{formatCurrency(availableBalance)}</span>
                    </div>

                    {qty > 0 && total > availableBalance && (
                      <p className="text-xs text-danger mb-3">Saldo insuficiente</p>
                    )}

                    <Button
                      className="w-full"
                      disabled={!canBuy}
                      onClick={() => setModalOpen(true)}
                    >
                      <ShoppingCart size={16} />
                      Comprar tokens
                    </Button>
                  </>
                )}
              </>
            )}
          </Card>
        </div>
      </div>

      {project && (
        <ConfirmModal
          open={modalOpen}
          title="Confirmar compra"
          onClose={() => setModalOpen(false)}
          onConfirm={handleBuy}
          loading={buying}
        >
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Projeto</span>
              <TickerLabel ticker={project.ticker} size="sm" />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Tokens</span>
              <span className="font-mono font-medium text-ink">{formatNumber(qty)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Preço unit.</span>
              <span className="font-mono text-ink">{formatCurrency(project.currentPrice)}</span>
            </div>
            <div className="border-t border-card-border pt-3 flex justify-between font-medium">
              <span className="text-ink">Total a pagar</span>
              <span className="font-mono text-violet-600 text-lg">{formatCurrency(total)}</span>
            </div>
          </div>
        </ConfirmModal>
      )}
    </AppLayout>
  );
}
