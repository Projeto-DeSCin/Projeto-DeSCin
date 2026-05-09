import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FeaturedProjectCard } from './FeaturedProjectCard';
import { useProjectStore } from '../../stores/project.store';
import { getProjectGradient } from '../../utils/color';
import type { FeaturedProject } from '../../mocks/dashboard';

type Tab = 'alta' | 'compradas' | 'vistas';

const TABS: { id: Tab; label: string }[] = [
  { id: 'alta',      label: 'Em alta'       },
  { id: 'compradas', label: 'Mais compradas' },
  { id: 'vistas',    label: 'Mais vistas'   },
];

function sortProjects(projects: FeaturedProject[], tab: Tab) {
  const copy = [...projects];
  if (tab === 'alta')      return copy.sort((a, b) => b.change7d  - a.change7d).slice(0, 3);
  if (tab === 'compradas') return copy.sort((a, b) => b.buyCount  - a.buyCount).slice(0, 3);
  return                          copy.sort((a, b) => b.viewCount - a.viewCount).slice(0, 3);
}

export function FeaturedProjects() {
  const [tab, setTab] = useState<Tab>('alta');
  const liveProjects = useProjectStore(s => s.projects);

  const featured: FeaturedProject[] = liveProjects
    .filter(p => p.status === 'approved')
    .map(p => {
      const code = p.ticker.split(':')[1];
      const soldPct = Math.round(((p.totalSupply - p.availableTokens) / p.totalSupply) * 100);
      const vol = p.volume24h >= 1000
        ? `R$ ${(p.volume24h / 1000).toFixed(1)}K`
        : `R$ ${p.volume24h.toFixed(0)}`;
      return {
        ticker: p.ticker,
        code,
        name: p.name,
        description: p.description,
        university: p.university,
        area: p.area,
        change7d: p.change24h ?? 0,
        price: p.currentPrice,
        soldPercent: soldPct,
        volume: vol,
        buyCount: p.holders,
        viewCount: p.holders * 3,
        gradient: getProjectGradient(p.ticker),
        accentColor: (p.change24h ?? 0) >= 0 ? '#22c55e' : 'var(--red)',
      };
    });

  const projects = sortProjects(featured, tab);

  return (
    <div>
      {/* Section header + tabs */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20, borderBottom: '1px solid var(--rule)', paddingBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 0 }}>
          <h3 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-primary)', marginRight: 24, paddingBottom: 14 }}>
            Projetos
          </h3>
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10, fontWeight: 600,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                padding: '8px 14px', background: 'none', border: 'none', cursor: 'pointer',
                color: tab === id ? 'var(--ink-primary)' : 'var(--ink-muted)',
                borderBottom: tab === id ? '1.5px solid var(--red)' : '1.5px solid transparent',
                marginBottom: -1,
                transition: 'color 150ms ease',
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <Link
          to="/explorar"
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', textDecoration: 'none', transition: 'color 150ms ease', paddingBottom: 14 }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--red)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-muted)'; }}
        >
          Ver todos →
        </Link>
      </div>

      {/* 3-column card grid */}
      {projects.length > 0 ? (
        <div className="dash-grid-3" style={{ alignItems: 'stretch' }}>
          {projects.map(project => (
            <FeaturedProjectCard key={project.ticker} project={project} tab={tab} />
          ))}
        </div>
      ) : (
        <div style={{ padding: '40px 0', textAlign: 'center' }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--ink-muted)' }}>
            Nenhum projeto aprovado no mercado ainda.
          </p>
        </div>
      )}
    </div>
  );
}
