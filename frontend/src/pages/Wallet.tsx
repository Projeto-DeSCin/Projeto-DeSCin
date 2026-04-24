import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet as WalletIcon, ArrowDownToLine, Copy } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { AssetRow } from '../components/project/AssetRow';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { SkeletonRow } from '../components/ui/Skeleton';
import { useWalletStore } from '../stores/wallet.store';
import { useTransactions } from '../hooks/useTransactions';
import { formatCurrency, formatDateTime, truncateHash } from '../utils/format';
import { TickerLabel } from '../components/ui/TickerLabel';
import { Badge } from '../components/ui/Badge';

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-5">
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <p className="font-mono font-bold text-2xl text-ink">{value}</p>
    </Card>
  );
}

export default function Wallet() {
  const navigate = useNavigate();
  const { availableBalance, totalInvested, assets, loading } = useWalletStore();
  const { transactions, loading: txLoading } = useTransactions();
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const total = availableBalance + totalInvested;

  const copyHash = async (hash: string) => {
    await navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 1500);
  };

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="font-display font-bold text-3xl text-ink mb-1">Carteira</h1>
        <p className="text-gray-400 text-sm">Seu patrimônio e histórico de transações</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Saldo disponível" value={formatCurrency(availableBalance)} />
        <StatCard label="Total investido" value={formatCurrency(totalInvested)} />
        <StatCard label="Patrimônio total" value={formatCurrency(total)} />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display font-bold text-ink">Meus Ativos</h2>
        <Button variant="secondary" size="sm" onClick={() => navigate('/explorar')}>
          Explorar projetos
        </Button>
      </div>

      <Card className="mb-8">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
        ) : assets.length === 0 ? (
          <EmptyState
            icon={<WalletIcon size={24} />}
            title="Nenhum ativo"
            description="Você ainda não comprou tokens de nenhum projeto."
            action={
              <Button onClick={() => navigate('/explorar')}>Explorar projetos</Button>
            }
          />
        ) : (
          assets.map(asset => (
            <AssetRow key={asset.ticker} asset={asset} showActions />
          ))
        )}
      </Card>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display font-bold text-ink">Histórico de Transações</h2>
      </div>

      <Card>
        {txLoading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
        ) : transactions.length === 0 ? (
          <EmptyState
            icon={<ArrowDownToLine size={24} />}
            title="Sem transações"
            description="Suas transações aparecerão aqui após o primeiro depósito ou compra."
          />
        ) : (
          <div>
            <div className="hidden sm:grid grid-cols-5 gap-4 px-6 py-3 text-xs font-medium text-gray-400 border-b border-card-border">
              <span>Tipo</span>
              <span className="col-span-2">Projeto / Descrição</span>
              <span className="text-right">Valor</span>
              <span className="text-right">Data</span>
            </div>
            {transactions.map(tx => (
              <div
                key={tx.hash}
                className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-4 px-6 py-4 border-b border-card-border last:border-b-0 hover:bg-surface transition-all duration-150"
              >
                <div>
                  <Badge variant={tx.type === 'deposit' ? 'violet' : 'amber'}>
                    {tx.type === 'deposit' ? 'Depósito' : 'Compra'}
                  </Badge>
                </div>
                <div className="sm:col-span-2">
                  {tx.ticker ? (
                    <TickerLabel ticker={tx.ticker} size="sm" />
                  ) : (
                    <span className="text-sm text-gray-400">Depósito em conta</span>
                  )}
                  <p className="text-xs text-gray-400 mt-0.5 font-mono flex items-center gap-1">
                    {truncateHash(tx.hash)}
                    <button
                      onClick={() => copyHash(tx.hash)}
                      className="text-gray-300 hover:text-gray-500 transition-colors"
                      title="Copiar hash"
                    >
                      {copiedHash === tx.hash ? (
                        <span className="text-success text-xs">✓</span>
                      ) : (
                        <Copy size={11} />
                      )}
                    </button>
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-medium text-ink">{formatCurrency(tx.value)}</p>
                  {tx.type === 'buy' && (
                    <p className="text-xs text-gray-400">{tx.amount} tokens</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{formatDateTime(tx.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </AppLayout>
  );
}
