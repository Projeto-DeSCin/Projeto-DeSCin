import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import {
  ArrowDownLeft, ArrowUpRight, ChevronRight, Copy, Check,
  History, Landmark, ExternalLink, TrendingUp, TrendingDown,
} from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { Modal } from '../components/ui/Modal';
import { WalletHero } from '../components/wallet/WalletHero';
import { AllocationDonut } from '../components/wallet/AllocationDonut';
import { DepositModal } from '../components/wallet/DepositModal';
import { WithdrawModal } from '../components/wallet/WithdrawModal';
import { useWalletStore } from '../stores/wallet.store';
import { useProjectStore } from '../stores/project.store';
import { formatCurrency, formatDateTime, truncateHash } from '../utils/format';
import { getProjectGradient, getTickerInitials } from '../utils/color';
import { MOCK_PORTFOLIO_HISTORY } from '../mocks/data';
import type { Transaction, PortfolioPoint, Period } from '../types';

// ─── Constants ────────────────────────────────────────────────────────────────
const GLASS: React.CSSProperties = {
  background: 'rgba(255,255,255,0.32)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(20,20,20,0.10)',
  borderRadius: 16,
};
const GLASS_PANEL: React.CSSProperties = { ...GLASS, padding: '28px 24px' };

const PERIODS: Period[] = ['1D', '7D', '1M', '3M', '1A', 'Tudo'];

type TxFilter = 'all' | 'buy' | 'sell' | 'deposit' | 'withdraw';
const TX_FILTER_LABELS: Record<TxFilter, string> = {
  all: 'Todas', buy: 'Compras', sell: 'Vendas', deposit: 'Depósitos', withdraw: 'Saques',
};

// ─── Spark ────────────────────────────────────────────────────────────────────
function Spark({ data, positive }: { data: number[]; positive: boolean }) {
  if (!data.length) return <span style={{ width: 64, height: 24, display: 'block' }} />;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const W = 64, H = 24;
  const pts = data.map((v, i) =>
    `${(i / (data.length - 1)) * W},${H - ((v - min) / range) * H}`
  ).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
      <polyline points={pts} fill="none"
        stroke={positive ? '#22c55e' : 'var(--red)'}
        strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── TxDetailModal ────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  confirmed: { bg: 'rgba(34,197,94,0.12)',  color: '#22c55e',    label: 'Confirmado' },
  pending:   { bg: 'rgba(234,179,8,0.12)',  color: '#eab308',    label: 'Pendente'   },
  failed:    { bg: 'rgba(229,37,26,0.12)',  color: 'var(--red)', label: 'Falhou'     },
};
const TYPE_LABELS: Record<string, string> = {
  buy: 'Compra', sell: 'Venda', deposit: 'Depósito', withdraw: 'Saque',
};

function TxDetailModal({ tx, onClose }: { tx: Transaction | null; onClose: () => void }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const copyHash = async () => {
    if (!tx) return;
    await navigator.clipboard.writeText(tx.hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!tx) return <Modal open={false} onClose={onClose}><></></Modal>;

  const status = STATUS_STYLES[tx.status];
  const rows: [string, string][] = [
    ['Tipo', TYPE_LABELS[tx.type] ?? tx.type],
    ['Valor', formatCurrency(tx.value)],
    ...(tx.ticker ? [['Projeto', tx.ticker] as [string, string]] : []),
    ...(tx.amount && tx.type === 'buy' ? [['Tokens', `${tx.amount.toLocaleString('pt-BR')} tokens`] as [string, string]] : []),
    ['Data', formatDateTime(tx.timestamp)],
  ];

  return (
    <Modal open={!!tx} title="Detalhes da transação" onClose={onClose} size="sm">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: status.bg, color: status.color }}>
            {status.label}
          </span>
        </div>
        <div>
          {rows.map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--rule)' }}>
              <span style={{ fontSize: 12, color: 'var(--ink-muted)' }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-primary)', fontFamily: label === 'Valor' || label === 'Tokens' ? "'JetBrains Mono',monospace" : undefined }}>
                {value}
              </span>
            </div>
          ))}
        </div>
        <div style={{ background: 'rgba(255,255,255,0.32)', border: '1px solid var(--rule)', borderRadius: 8, padding: '10px 12px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 6 }}>Hash</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono',monospace", color: 'var(--ink-secondary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {truncateHash(tx.hash)}
            </span>
            <button onClick={copyHash} style={{ color: 'var(--ink-muted)', cursor: 'pointer', background: 'none', border: 'none', padding: 2 }}>
              {copied ? <Check size={13} style={{ color: '#22c55e' }} /> : <Copy size={13} />}
            </button>
          </div>
        </div>
        {tx.ticker && (
          <button
            onClick={() => { navigate(`/projetos/${encodeURIComponent(tx.ticker!)}`); onClose(); }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 0', borderRadius: 8, fontSize: 14, fontWeight: 600, background: 'var(--red)', color: '#fff', border: 'none', cursor: 'pointer' }}>
            <ExternalLink size={14} />
            Ver projeto
          </button>
        )}
      </div>
    </Modal>
  );
}

// ─── Period filter ────────────────────────────────────────────────────────────
function filterByPeriod(data: PortfolioPoint[], period: Period): PortfolioPoint[] {
  if (period === 'Tudo') return data;
  const now = new Date(), cutoff = new Date(now);
  if (period === '1D') cutoff.setDate(now.getDate() - 1);
  else if (period === '7D') cutoff.setDate(now.getDate() - 7);
  else if (period === '1M') cutoff.setMonth(now.getMonth() - 1);
  else if (period === '3M') cutoff.setMonth(now.getMonth() - 3);
  else if (period === '1A') cutoff.setFullYear(now.getFullYear() - 1);
  return data.filter(p => new Date(p.timestamp) >= cutoff);
}

function relativeDate(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return 'Hoje';
  if (d === 1) return 'Ontem';
  if (d < 30) return `${d} dias atrás`;
  return formatDateTime(ts);
}

const TYPE_ICON: Record<string, React.ReactNode> = {
  buy:      <TrendingUp size={14} />,
  sell:     <TrendingDown size={14} />,
  deposit:  <ArrowDownLeft size={14} />,
  withdraw: <ArrowUpRight size={14} />,
};
const TYPE_COLOR: Record<string, string> = {
  buy: '#22c55e', sell: 'var(--red)', deposit: '#3b82f6', withdraw: '#eab308',
};

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Wallet() {
  const navigate = useNavigate();
  const {
    availableBalance, assets, loading,
    transactions, lastSync,
  } = useWalletStore();
  const liveProjects = useProjectStore(s => s.projects);

  // Compute live asset values from current market prices
  const liveAssets = useMemo(() => assets.map(a => {
    const live = liveProjects.find(p => p.ticker === a.ticker);
    const livePrice = live?.currentPrice ?? a.averagePrice;
    const liveValue = a.tokensOwned * livePrice;
    const livePnl = (livePrice - a.averagePrice) * a.tokensOwned;
    const livePnlPct = a.averagePrice > 0 ? (livePrice - a.averagePrice) / a.averagePrice * 100 : 0;
    return { ...a, currentValue: liveValue, pnl: livePnl, pnlPercent: livePnlPct, change24h: live?.change24h ?? a.change24h };
  }), [assets, liveProjects]);

  const liveTotalInvested = liveAssets.reduce((s, a) => s + a.currentValue, 0);
  const totalValue = liveTotalInvested + availableBalance;

  const [showDeposit, setShowDeposit]   = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [selectedTx, setSelectedTx]    = useState<Transaction | null>(null);
  const [period, setPeriod]             = useState<Period>('1M');
  const [txFilter, setTxFilter]         = useState<TxFilter>('all');
  const [hoveredAsset, setHoveredAsset] = useState<string | null>(null);

  const chartData = useMemo(() => filterByPeriod(MOCK_PORTFOLIO_HISTORY, period), [period]);
  const firstVal  = chartData[0]?.value ?? 0;
  const lastVal   = chartData[chartData.length - 1]?.value ?? 0;
  const chartPct  = firstVal ? ((lastVal - firstVal) / firstVal) * 100 : 0;
  const chartPos  = chartPct >= 0;

  const totalPnl = liveAssets.reduce((s, a) => s + a.pnl, 0);
  const pnlPos   = totalPnl >= 0;

  const filteredTxs = useMemo(() =>
    txFilter === 'all' ? transactions : transactions.filter(tx => tx.type === txFilter),
    [transactions, txFilter]
  );

  const chartMin = chartData.length ? Math.min(...chartData.map(p => p.value)) : 0;
  const chartMax = chartData.length ? Math.max(...chartData.map(p => p.value)) : 0;

  return (
    <AppLayout>

      {/* ── Section 1: Hero ── */}
      <section className="page-s1">
        <WalletHero assetsCount={assets.length} lastSync={lastSync} />
      </section>

      {/* ── Section 2: Patrimônio + Donut ── */}
      <section className="page-s2" style={{ marginBottom: 24 }}>
        <div style={{ ...GLASS, overflow: 'hidden' }}>
          <div className="dash-grid-75" style={{ gap: 0 }}>

            {/* Left: balance + actions */}
            <div style={{ padding: '32px 28px', borderRight: '1px solid var(--rule)' }}>
              <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 12 }}>
                Patrimônio total
              </p>
              <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 44, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--ink-primary)', lineHeight: 1, marginBottom: 28, fontVariantNumeric: 'tabular-nums' }}>
                {formatCurrency(totalValue || availableBalance)}
              </p>

              <div className="proj-2col" style={{ marginBottom: 28 }}>
                {[
                  { label: 'Saldo disponível', value: formatCurrency(availableBalance), accent: false, positive: true },
                  { label: 'Total investido',  value: formatCurrency(liveTotalInvested), accent: false, positive: true },
                  { label: 'Retorno total',    value: `${pnlPos ? '+' : ''}${formatCurrency(totalPnl)}`, accent: true, positive: pnlPos },
                  { label: 'Posições abertas', value: `${liveAssets.length} ativos`,    accent: false, positive: true },
                ].map(s => (
                  <div key={s.label} style={{ background: 'rgba(255,255,255,0.32)', border: '1px solid var(--rule)', borderRadius: 10, padding: '12px 14px' }}>
                    <p style={{ fontSize: 11, color: 'var(--ink-muted)', marginBottom: 4 }}>{s.label}</p>
                    <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 15, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: s.accent ? (s.positive ? '#22c55e' : 'var(--red)') : 'var(--ink-primary)' }}>
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Glass buttons */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setShowDeposit(true)}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    height: 48, padding: '0 20px', borderRadius: 12, overflow: 'hidden',
                    background: 'rgba(229, 37, 26, 0.10)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    border: '1px solid rgba(229, 37, 26, 0.18)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 4px 16px rgba(229,37,26,0.08)',
                    cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(0.99)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                  onMouseDown={e  => { e.currentTarget.style.transform = 'scale(0.97)'; }}
                  onMouseUp={e    => { e.currentTarget.style.transform = 'scale(0.99)'; }}
                >
                  <ArrowDownLeft size={16} style={{ color: 'var(--red-deep)' }} />
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--red-deep)' }}>
                    Depositar
                  </span>
                </button>

                <button
                  onClick={() => setShowWithdraw(true)}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    height: 48, padding: '0 20px', borderRadius: 12, overflow: 'hidden',
                    background: 'rgba(255, 255, 255, 0.45)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    border: '1px solid var(--glass-border)',
                    boxShadow: 'inset 0 1px 0 var(--glass-highlight), 0 4px 16px rgba(20,20,20,0.04)',
                    cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(0.99)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                  onMouseDown={e  => { e.currentTarget.style.transform = 'scale(0.97)'; }}
                  onMouseUp={e    => { e.currentTarget.style.transform = 'scale(0.99)'; }}
                >
                  <ArrowUpRight size={16} style={{ color: 'var(--ink-primary)' }} />
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--ink-primary)' }}>
                    Sacar
                  </span>
                </button>
              </div>
            </div>

            {/* Right: donut */}
            <div style={{ padding: '32px 24px' }}>
              <AllocationDonut />
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Portfolio chart ── */}
      <section className="page-s3" style={{ marginBottom: 24 }}>
        <div style={GLASS_PANEL}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 4 }}>
                Evolução do patrimônio
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 22, fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: 'var(--ink-primary)' }}>
                  {formatCurrency(lastVal || totalValue)}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 600, color: chartPos ? '#22c55e' : 'var(--red)' }}>
                  {chartPos ? '+' : ''}{chartPct.toFixed(2)}%
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {PERIODS.map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  style={{
                    padding: '4px 10px', borderRadius: 6,
                    fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 600,
                    background: period === p ? 'var(--red)' : 'rgba(255,255,255,0.40)',
                    color: period === p ? '#fff' : 'var(--ink-muted)',
                    border: '1px solid var(--rule)', cursor: 'pointer',
                  }}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="walletGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={chartPos ? '#22c55e' : '#E5251A'} stopOpacity={0.22} />
                  <stop offset="100%" stopColor={chartPos ? '#22c55e' : '#E5251A'} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(20,20,20,0.06)" />
              <XAxis dataKey="timestamp"
                tick={{ fontSize: 10, fill: 'var(--ink-muted)', fontFamily: "'JetBrains Mono',monospace" }}
                tickLine={false} axisLine={false}
                tickFormatter={v => (v as string).slice(5)} interval="preserveStartEnd"
              />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ background: 'rgba(255,255,255,0.96)', border: '1px solid rgba(20,20,20,0.10)', borderRadius: 8, fontSize: 12, fontFamily: "'JetBrains Mono',monospace", boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}
                formatter={(v) => [formatCurrency(Number(v)), 'Patrimônio']}
                labelFormatter={(l) => String(l)}
              />
              <Area type="monotone" dataKey="value"
                stroke={chartPos ? '#22c55e' : '#E5251A'} strokeWidth={2}
                fill="url(#walletGrad)" dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>

          <div className="dash-grid-3" style={{ marginTop: 20, gap: 12 }}>
            {[
              { label: 'Variação período', value: `${chartPos ? '+' : ''}${chartPct.toFixed(2)}%`, color: chartPos ? '#22c55e' : 'var(--red)' },
              { label: 'Mínimo do período', value: formatCurrency(chartMin), color: 'var(--ink-primary)' },
              { label: 'Máximo do período', value: formatCurrency(chartMax), color: 'var(--ink-primary)' },
              { label: 'P&L total',         value: `${pnlPos ? '+' : ''}${formatCurrency(totalPnl)}`, color: pnlPos ? '#22c55e' : 'var(--red)' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.32)', border: '1px solid var(--rule)', borderRadius: 10, padding: '12px 14px' }}>
                <p style={{ fontSize: 11, color: 'var(--ink-muted)', marginBottom: 4 }}>{s.label}</p>
                <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: Positions ── */}
      <section className="page-s4" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>Posições</p>
          <button onClick={() => navigate('/explorar')}
            style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 600, color: 'var(--red)', background: 'none', border: 'none', cursor: 'pointer' }}>
            Explorar projetos →
          </button>
        </div>

        {loading ? (
          <div style={{ ...GLASS_PANEL, textAlign: 'center', color: 'var(--ink-muted)', fontSize: 14 }}>Carregando...</div>
        ) : liveAssets.length === 0 ? (
          <div style={{ ...GLASS_PANEL, textAlign: 'center', padding: '52px 24px' }}>
            <Landmark size={32} style={{ margin: '0 auto 12px', color: 'var(--ink-muted)' }} />
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-primary)', marginBottom: 6 }}>Nenhuma posição aberta</p>
            <p style={{ fontSize: 13, color: 'var(--ink-muted)', marginBottom: 20 }}>Explore projetos e faça sua primeira compra de tokens.</p>
            <button onClick={() => navigate('/explorar')}
              style={{ padding: '10px 20px', borderRadius: 8, background: 'var(--red)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', border: 'none' }}>
              Explorar agora
            </button>
          </div>
        ) : (
          <div style={{ ...GLASS, overflow: 'hidden' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 64px 90px',
              padding: '10px 20px', borderBottom: '1px solid var(--rule)',
              fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)',
            }}>
              <span>Projeto</span>
              <span style={{ textAlign: 'right' }}>Tokens</span>
              <span style={{ textAlign: 'right' }}>Preço médio</span>
              <span style={{ textAlign: 'right' }}>Valor atual</span>
              <span style={{ textAlign: 'center' }}>7 dias</span>
              <span style={{ textAlign: 'right' }}>P&L</span>
            </div>
            {assets.map((asset, idx) => {
              const pos = asset.pnl >= 0;
              const hov = hoveredAsset === asset.ticker;
              return (
                <div key={asset.ticker}
                  onMouseEnter={() => setHoveredAsset(asset.ticker)}
                  onMouseLeave={() => setHoveredAsset(null)}
                  onClick={() => navigate(`/projetos/${encodeURIComponent(asset.ticker)}`)}
                  style={{
                    display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 64px 90px',
                    padding: '14px 20px',
                    borderBottom: idx < assets.length - 1 ? '1px solid var(--rule)' : 'none',
                    background: hov ? 'rgba(255,255,255,0.18)' : 'transparent',
                    transition: 'background 0.15s', alignItems: 'center', cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: getProjectGradient(asset.ticker), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: '#fff', fontFamily: "'JetBrains Mono',monospace" }}>
                        {getTickerInitials(asset.ticker)}
                      </span>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-primary)', lineHeight: 1.2, marginBottom: 2 }}>
                        {asset.ticker.replace('PROJ:', '')}
                      </p>
                      <p style={{ fontSize: 11, color: 'var(--ink-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>
                        {asset.projectName}
                      </p>
                    </div>
                    {hov && (
                      <div style={{ display: 'flex', gap: 4, marginLeft: 4, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => navigate(`/projetos/${encodeURIComponent(asset.ticker)}`)}
                          style={{ padding: '3px 7px', borderRadius: 5, fontSize: 10, fontWeight: 700, background: 'rgba(34,197,94,0.14)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.25)', cursor: 'pointer' }}>
                          + Comprar
                        </button>
                        <button onClick={() => navigate(`/projetos/${encodeURIComponent(asset.ticker)}`)}
                          style={{ padding: '3px 7px', borderRadius: 5, fontSize: 10, fontWeight: 700, background: 'rgba(229,37,26,0.10)', color: 'var(--red)', border: '1px solid rgba(229,37,26,0.22)', cursor: 'pointer' }}>
                          − Vender
                        </button>
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: 'var(--ink-primary)' }}>{asset.tokensOwned.toLocaleString('pt-BR')}</p>
                    <p style={{ fontSize: 11, color: 'var(--ink-muted)' }}>tokens</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: 'var(--ink-primary)' }}>{formatCurrency(asset.averagePrice)}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: 'var(--ink-primary)' }}>{formatCurrency(asset.currentValue)}</p>
                    <p style={{ fontSize: 11, color: asset.change24h >= 0 ? '#22c55e' : 'var(--red)' }}>{asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}% 24h</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Spark data={asset.priceHistory} positive={pos} />
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: pos ? '#22c55e' : 'var(--red)' }}>{pos ? '+' : ''}{formatCurrency(asset.pnl)}</p>
                    <p style={{ fontSize: 11, color: pos ? '#22c55e' : 'var(--red)' }}>{pos ? '+' : ''}{asset.pnlPercent.toFixed(2)}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Section 5: Transaction history ── */}
      <section className="page-s5" style={{ marginBottom: 60 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
            Histórico de transações
          </p>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {(Object.keys(TX_FILTER_LABELS) as TxFilter[]).map(f => (
              <button key={f} onClick={() => setTxFilter(f)}
                style={{
                  padding: '4px 10px', borderRadius: 6, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 600,
                  background: txFilter === f ? 'var(--red)' : 'rgba(255,255,255,0.40)',
                  color: txFilter === f ? '#fff' : 'var(--ink-muted)',
                  border: '1px solid var(--rule)', cursor: 'pointer',
                }}>
                {TX_FILTER_LABELS[f]}
              </button>
            ))}
          </div>
        </div>

        {filteredTxs.length === 0 ? (
          <div style={{ ...GLASS_PANEL, textAlign: 'center', padding: '52px 24px' }}>
            <History size={28} style={{ margin: '0 auto 10px', color: 'var(--ink-muted)' }} />
            <p style={{ fontSize: 14, color: 'var(--ink-muted)' }}>Nenhuma transação encontrada.</p>
          </div>
        ) : (
          <div style={{ ...GLASS, overflow: 'hidden' }}>
            {filteredTxs.map((tx, i) => {
              const tColor = TYPE_COLOR[tx.type] ?? 'var(--ink-muted)';
              const status = STATUS_STYLES[tx.status];
              const debit  = tx.type === 'buy' || tx.type === 'withdraw';
              return (
                <div key={tx.hash} onClick={() => setSelectedTx(tx)}
                  style={{
                    display: 'grid', gridTemplateColumns: '36px 1fr auto auto',
                    padding: '14px 20px', gap: 14, alignItems: 'center', cursor: 'pointer',
                    borderBottom: i < filteredTxs.length - 1 ? '1px solid var(--rule)' : 'none',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.16)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: tColor, background: `${tColor}18` }}>
                    {TYPE_ICON[tx.type]}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-primary)' }}>
                        {tx.ticker ? tx.ticker.replace('PROJ:', '') : TYPE_LABELS[tx.type] ?? tx.type}
                      </span>
                      {tx.projectName && (
                        <span style={{ fontSize: 11, color: 'var(--ink-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
                          {tx.projectName}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'var(--ink-muted)' }}>{truncateHash(tx.hash)}</span>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 4, background: status.bg, color: status.color }}>{status.label}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: debit ? 'var(--red)' : '#22c55e' }}>
                      {debit ? '−' : '+'}{formatCurrency(tx.value)}
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 2 }}>{relativeDate(tx.timestamp)}</p>
                  </div>
                  <ChevronRight size={14} style={{ color: 'var(--ink-muted)', flexShrink: 0 }} />
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Modals ── */}
      <DepositModal  open={showDeposit}  onClose={() => setShowDeposit(false)} />
      <WithdrawModal open={showWithdraw} onClose={() => setShowWithdraw(false)} />
      <TxDetailModal tx={selectedTx}    onClose={() => setSelectedTx(null)} />

    </AppLayout>
  );
}
