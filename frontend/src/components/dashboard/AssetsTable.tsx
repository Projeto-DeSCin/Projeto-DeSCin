import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useWalletStore } from '../../stores/wallet.store';

function fmt(n: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
}

export function AssetsTable() {
  const navigate = useNavigate();
  const assets = useWalletStore(s => s.assets);
  const MOCK_DASH_ASSETS = assets.map(a => ({
    ticker: a.ticker,
    code: a.ticker.replace('PROJ:', ''),
    university: '',
    tokens: a.tokensOwned,
    price: a.averagePrice,
    change24h: a.change24h,
    total: a.currentValue,
    color: '#7C3AED',
  }));
  const total = MOCK_DASH_ASSETS.reduce((a, x) => a + x.total, 0);

  return (
    <div style={{ background: 'rgba(255,255,255,0.32)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', border: '1px solid rgba(20,20,20,0.08)', borderRadius: 20, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.65), 0 4px 16px rgba(20,20,20,0.05)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '24px 28px 16px', borderBottom: '1px solid var(--rule)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-primary)' }}>
            Meus ativos
          </h3>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginTop: 4, display: 'block' }}>
            {MOCK_DASH_ASSETS.length} posições · {fmt(total)} alocados
          </span>
        </div>
        <Link to="/wallet" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', textDecoration: 'none', transition: 'color 150ms ease' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--red)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-muted)'; }}>
          Ver tudo →
        </Link>
      </div>

      {/* Column headers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto auto', gap: 16, padding: '10px 28px', borderBottom: '1px solid rgba(20,20,20,0.04)' }}>
        {['Ativo', 'Posição', 'Preço', '24h', 'Total'].map((col) => (
          <span key={col} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-muted)', textAlign: col === 'Ativo' ? 'left' : 'right' }}>
            {col}
          </span>
        ))}
      </div>

      {/* Rows */}
      {MOCK_DASH_ASSETS.map((a, i) => {
        const pos = a.change24h >= 0;
        return (
          <div
            key={a.ticker}
            onClick={() => navigate(`/projetos/${a.code}`)}
            style={{
              display: 'grid', gridTemplateColumns: '1fr auto auto auto auto', gap: 16,
              padding: '0 28px', height: 62, alignItems: 'center', cursor: 'pointer',
              borderBottom: i < MOCK_DASH_ASSETS.length - 1 ? '1px solid rgba(20,20,20,0.05)' : 'none',
              transition: 'background 150ms ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.40)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            {/* Ativo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(20,20,20,0.06)' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 10, color: 'rgba(255,255,255,0.90)', letterSpacing: '0.04em' }}>{a.code.slice(0, 2)}</span>
              </div>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: 'var(--ink-primary)', letterSpacing: '0.02em' }}>{a.code}</div>
                <div style={{ fontFamily: "'Geist', sans-serif", fontSize: 11, color: 'var(--ink-muted)', marginTop: 1 }}>{a.university}</div>
              </div>
            </div>
            {/* Posição */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: 'var(--ink-primary)', fontVariantNumeric: 'tabular-nums' }}>{a.tokens}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--ink-muted)', textTransform: 'uppercase' }}>tokens</div>
            </div>
            {/* Preço */}
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: 'var(--ink-primary)', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>
              R$ {a.price.toFixed(2)}
            </div>
            {/* 24h */}
            <div style={{ padding: '3px 8px', borderRadius: 6, background: pos ? 'rgba(34,197,94,0.10)' : 'rgba(229,37,26,0.08)', border: `1px solid ${pos ? 'rgba(34,197,94,0.18)' : 'rgba(229,37,26,0.14)'}`, textAlign: 'center' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: pos ? '#22c55e' : 'var(--red)', fontVariantNumeric: 'tabular-nums' }}>
                {pos ? '+' : ''}{a.change24h.toFixed(1)}%
              </span>
            </div>
            {/* Total */}
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, color: 'var(--ink-primary)', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>
              {fmt(a.total)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
