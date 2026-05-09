import { formatRelativeTime } from '../../utils/format';
import { getFormattedDateTime } from '../../utils/briefing';

interface WalletHeroProps {
  assetsCount: number;
  lastSync: number;
}

export function WalletHero({ assetsCount: _assetsCount, lastSync }: WalletHeroProps) {
  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11, fontWeight: 500, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'var(--ink-muted)',
        }}>
          {getFormattedDateTime()}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%', background: 'var(--red)',
            display: 'inline-block', animation: 'pulse-live 2s ease-in-out infinite',
          }} />
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11, fontWeight: 500, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'var(--ink-secondary)',
          }}>
            Sincronizado · {formatRelativeTime(lastSync)}
          </span>
        </div>
      </div>

      <h1 style={{
        fontFamily: "'JetBrains Mono', monospace",
        textTransform: 'uppercase', fontWeight: 600,
        lineHeight: 0.95, letterSpacing: '-0.02em', margin: 0,
      }}>
        <span style={{ display: 'block', fontSize: 'clamp(40px, 5.5vw, 80px)', color: 'var(--ink-primary)' }}>
          Sua
        </span>
        <span style={{ display: 'block', fontSize: 'clamp(40px, 5.5vw, 80px)', color: 'var(--red)' }}>
          carteira.
        </span>
      </h1>

      <div style={{ marginTop: 32, borderBottom: '1px solid var(--rule)' }} />
    </div>
  );
}
