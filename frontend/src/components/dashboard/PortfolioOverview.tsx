import { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Compass, Wallet } from 'lucide-react';
import { useWalletStore } from '../../stores/wallet.store';
import { useProjectStore } from '../../stores/project.store';
import { formatCurrency } from '../../utils/format';

function useCount(target: number, delay = 0) {
  const [val, setVal] = useState(0);
  const raf = useRef(0);
  useEffect(() => {
    if (!target) { setVal(0); return; }
    const t0 = performance.now() + delay;
    const tick = (now: number) => {
      const t = Math.min(Math.max((now - t0) / 900, 0), 1);
      setVal(target * (1 - Math.pow(1 - t, 4)));
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else setVal(target);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, delay]);
  return val;
}

interface StatRowProps { label: string; value: string; accent?: 'success' | 'danger'; }
function StatRow({ label, value, accent }: StatRowProps) {
  const color = accent === 'success' ? '#22c55e' : accent === 'danger' ? 'var(--red)' : 'var(--ink-primary)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
        {label}
      </span>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color, letterSpacing: '-0.01em' }}>
        {value}
      </span>
    </div>
  );
}

export function PortfolioOverview() {
  const navigate = useNavigate();
  const { availableBalance, assets } = useWalletStore();
  const liveProjects = useProjectStore(s => s.projects);

  const { liveTotalInvested, totalValue, totalPnl } = useMemo(() => {
    const liveAssets = assets.map(a => {
      const live = liveProjects.find(p => p.ticker === a.ticker);
      const livePrice = live?.currentPrice ?? a.averagePrice;
      const liveValue = a.tokensOwned * livePrice;
      const pnl = (livePrice - a.averagePrice) * a.tokensOwned;
      return { currentValue: liveValue, pnl };
    });
    const invested = liveAssets.reduce((s, a) => s + a.currentValue, 0);
    const pnl = liveAssets.reduce((s, a) => s + a.pnl, 0);
    return { liveTotalInvested: invested, totalValue: invested + availableBalance, totalPnl: pnl };
  }, [assets, availableBalance, liveProjects]);

  const animTotal    = useCount(totalValue, 0);
  const animAvail    = useCount(availableBalance, 80);
  const animInvested = useCount(liveTotalInvested, 160);
  const animPnl      = useCount(Math.abs(totalPnl), 240);

  const pnlPos = totalPnl >= 0;

  const [intPart, decPart] = formatCurrency(animTotal).split(',');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Big number */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
            Patrimônio total
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
            BRL
          </span>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, lineHeight: 1, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
          <span style={{ fontSize: 'clamp(40px, 4.5vw, 64px)', color: 'var(--ink-primary)' }}>{intPart},</span>
          <span style={{ fontSize: 'clamp(40px, 4.5vw, 64px)', color: 'var(--ink-muted)' }}>{decPart ?? '00'}</span>
        </div>
        {totalPnl !== 0 && (
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 7, background: pnlPos ? 'rgba(34,197,94,0.10)' : 'rgba(229,37,26,0.10)', border: `1px solid ${pnlPos ? 'rgba(34,197,94,0.18)' : 'rgba(229,37,26,0.18)'}` }}>
              <ArrowUpRight size={12} style={{ color: pnlPos ? '#22c55e' : 'var(--red)', transform: pnlPos ? 'none' : 'rotate(180deg)' }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: pnlPos ? '#22c55e' : 'var(--red)', fontVariantNumeric: 'tabular-nums' }}>
                {pnlPos ? '+' : '-'}{formatCurrency(animPnl)}
              </span>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--ink-secondary)', fontVariantNumeric: 'tabular-nums' }}>
              P&L total
            </span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 24, borderTop: '1px solid var(--rule)' }}>
        <StatRow label="Saldo disponível" value={formatCurrency(animAvail)} />
        <StatRow label="Total investido"  value={formatCurrency(animInvested)} />
        <StatRow label="P&L total"        value={`${pnlPos ? '+' : '-'}${formatCurrency(animPnl)}`} accent={pnlPos ? 'success' : 'danger'} />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10 }}>
        {[
          { label: 'Carteira',  icon: <Wallet size={13} />,  path: '/wallet'   },
          { label: 'Explorar', icon: <Compass size={13} />, path: '/explorar' },
        ].map(({ label, icon, path }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7, height: 42, padding: '0 18px',
              borderRadius: 11, border: '1.5px solid var(--rule)',
              background: 'transparent', color: 'var(--ink-primary)',
              fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600,
              letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
              transition: 'transform 120ms ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)'; }}
          >
            {icon}{label}
          </button>
        ))}
      </div>
    </div>
  );
}
