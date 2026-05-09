import { useNavigate } from 'react-router-dom';
import { Plus, TrendingUp, TrendingDown, Clock, XCircle, CheckCircle } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { useProjectStore } from '../../stores/project.store';
import { useAuthStore } from '../../stores/auth.store';
import { formatCurrency, formatDate } from '../../utils/format';
import { getProjectGradient } from '../../utils/color';
import { getFormattedDateTime } from '../../utils/briefing';
import type { LiveProject } from '../../stores/project.store';

// ─── Styles ───────────────────────────────────────────────────────────────────
const GLASS: React.CSSProperties = {
  background: 'rgba(255,255,255,0.32)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(20,20,20,0.08)',
  borderRadius: 20,
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.65), 0 4px 16px rgba(20,20,20,0.05)',
};

// ─── Status badge ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  approved: { label: 'No mercado', color: '#16a34a', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.25)', icon: CheckCircle },
  pending:  { label: 'Em análise', color: '#b45309', bg: 'rgba(234,179,8,0.12)', border: 'rgba(234,179,8,0.30)', icon: Clock },
  rejected: { label: 'Rejeitado',  color: '#dc2626', bg: 'rgba(229,37,26,0.10)', border: 'rgba(229,37,26,0.22)', icon: XCircle },
  changes_requested: { label: 'Revisão',  color: '#7c3aed', bg: 'rgba(124,58,237,0.10)', border: 'rgba(124,58,237,0.22)', icon: Clock },
};

// ─── Project card ─────────────────────────────────────────────────────────────
function FounderProjectCard({ project }: { project: LiveProject }) {
  const navigate = useNavigate();
  const code = project.ticker.split(':')[1];
  const gradient = getProjectGradient(project.ticker);
  const pos = (project.change24h ?? 0) >= 0;
  const isApproved = project.status === 'approved';
  const cfg = STATUS_CONFIG[project.status] ?? STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  const soldPct = Math.round(((project.totalSupply - project.availableTokens) / project.totalSupply) * 100);

  return (
    <div
      onClick={() => navigate(`/founder/${code}`)}
      style={{ ...GLASS, overflow: 'hidden', cursor: 'pointer', transition: 'transform 220ms ease, box-shadow 220ms ease' }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.70), 0 12px 32px rgba(20,20,20,0.10)'; }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.65), 0 4px 16px rgba(20,20,20,0.05)'; }}
    >
      {/* Gradient header */}
      <div style={{ background: gradient, height: 100, padding: '14px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.70)', letterSpacing: '0.08em' }}>{code}</span>
          {isApproved && (
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: pos ? '#22c55e' : '#ff6b6b', fontVariantNumeric: 'tabular-nums' }}>
              {pos ? '+' : ''}{project.change24h.toFixed(1)}%
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ padding: '3px 8px', borderRadius: 4, background: cfg.bg, border: `1px solid ${cfg.border}`, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Icon size={10} style={{ color: cfg.color }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: cfg.color }}>{cfg.label}</span>
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 18px 18px' }}>
        <h3 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em', color: 'var(--ink-primary)', marginBottom: 6 }}>
          {project.name}
        </h3>
        <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 11, color: 'var(--ink-secondary)', marginBottom: 12, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {project.description}
        </p>

        {isApproved ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            <div>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 2 }}>Preço atual</p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: 'var(--ink-primary)', fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(project.currentPrice)}</p>
            </div>
            <div>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 2 }}>Market Cap</p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: 'var(--ink-primary)', fontVariantNumeric: 'tabular-nums' }}>
                R$ {(project.marketCap / 1000).toFixed(0)}K
              </p>
            </div>
            <div>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 2 }}>Volume 24h</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {pos ? <TrendingUp size={11} style={{ color: '#22c55e' }} /> : <TrendingDown size={11} style={{ color: '#dc2626' }} />}
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: 'var(--ink-primary)', fontVariantNumeric: 'tabular-nums' }}>
                  R$ {(project.volume24h / 1000).toFixed(1)}K
                </p>
              </div>
            </div>
            <div>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 2 }}>Holders</p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: 'var(--ink-primary)' }}>{project.holders}</p>
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 2 }}>Submetido em</p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--ink-primary)' }}>{formatDate(project.submittedAt)}</p>
            {project.status === 'rejected' && project.curationHistory.length > 0 && (
              <div style={{ marginTop: 10, padding: '10px 12px', borderRadius: 8, background: 'rgba(229,37,26,0.07)', border: '1px solid rgba(229,37,26,0.15)' }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, color: 'var(--red)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>Motivo</p>
                <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 11, color: 'var(--ink-secondary)' }}>
                  {project.curationHistory[project.curationHistory.length - 1]?.reason ?? '—'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Progress bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.10em' }}>Captação</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 600, color: 'var(--ink-primary)' }}>{soldPct}%</span>
          </div>
          <div style={{ height: 3, background: 'rgba(20,20,20,0.08)', borderRadius: 2 }}>
            <div style={{ height: '100%', width: `${soldPct}%`, background: 'var(--ink-primary)', borderRadius: 2, transition: 'width 0.4s ease' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function FounderDashboard() {
  const navigate = useNavigate();
  const { user, hasRole } = useAuthStore();
  const { projects } = useProjectStore();

  if (!hasRole('founder')) {
    return (
      <AppLayout>
        <div style={{ textAlign: 'center', padding: '96px 24px' }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--ink-muted)' }}>
            Acesso restrito a criadores de projetos.
          </p>
        </div>
      </AppLayout>
    );
  }

  const myProjects = projects.filter(p => p.founderId === user?.id);
  const approved   = myProjects.filter(p => p.status === 'approved');
  const pending    = myProjects.filter(p => p.status === 'pending');
  const rejected   = myProjects.filter(p => p.status === 'rejected');

  const totalMktCap  = approved.reduce((s, p) => s + p.marketCap, 0);
  const totalVol24h  = approved.reduce((s, p) => s + p.volume24h, 0);
  const totalHolders = approved.reduce((s, p) => s + p.holders, 0);

  return (
    <AppLayout>
      {/* Hero */}
      <section className="page-s1" style={{ marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid var(--rule)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: 16 }}>
              {getFormattedDateTime()}
            </span>
            <h1 style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, textTransform: 'uppercase', lineHeight: 0.95, letterSpacing: '-0.025em' }}>
              <span style={{ display: 'block', fontSize: 'clamp(36px, 4.5vw, 64px)', color: 'var(--ink-primary)' }}>Seus ativos</span>
              <span style={{ display: 'block', fontSize: 'clamp(36px, 4.5vw, 64px)', color: 'var(--red)' }}>no mercado.</span>
            </h1>
          </div>

          <button
            onClick={() => navigate('/criar-projeto')}
            style={{ display: 'flex', alignItems: 'center', gap: 10, height: 48, padding: '0 24px', borderRadius: 12, border: 'none', background: 'var(--ink-primary)', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--bg-form)', cursor: 'pointer', boxShadow: '0 4px 16px rgba(10,10,10,0.20)', transition: 'transform 0.15s, box-shadow 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <Plus size={16} />
            Criar projeto
          </button>
        </div>
      </section>

      {/* Aggregate stats */}
      {approved.length > 0 && (
        <section className="page-s2" style={{ marginBottom: 32 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { label: 'Market cap total', value: `R$ ${(totalMktCap / 1000).toFixed(0)}K` },
              { label: 'Volume 24h',       value: `R$ ${(totalVol24h / 1000).toFixed(1)}K` },
              { label: 'Total holders',    value: String(totalHolders) },
            ].map(s => (
              <div key={s.label} style={{ ...GLASS, padding: '20px 24px' }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 8 }}>{s.label}</p>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 700, color: 'var(--ink-primary)', fontVariantNumeric: 'tabular-nums' }}>{s.value}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* No projects */}
      {myProjects.length === 0 && (
        <section className="page-s3">
          <div style={{ ...GLASS, padding: '64px 24px', textAlign: 'center' }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 24, fontWeight: 600, color: 'var(--ink-primary)', marginBottom: 12 }}>Sem projetos ainda</p>
            <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 14, color: 'var(--ink-secondary)', marginBottom: 24 }}>
              Crie seu primeiro projeto e submeta para curadoria.
            </p>
            <button
              onClick={() => navigate('/criar-projeto')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 48, padding: '0 28px', borderRadius: 12, border: 'none', background: 'var(--red)', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#fff', cursor: 'pointer', boxShadow: '0 4px 16px rgba(229,37,26,0.25)' }}
            >
              <Plus size={16} />
              Criar primeiro projeto
            </button>
          </div>
        </section>
      )}

      {/* Projects by section */}
      {[
        { label: 'No mercado', items: approved, color: '#16a34a' },
        { label: 'Em análise', items: pending,  color: '#b45309' },
        { label: 'Rejeitados', items: rejected, color: 'var(--red)' },
      ].filter(s => s.items.length > 0).map(section => (
        <section key={section.label} className="page-s4" style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: section.color }}>{section.label}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--ink-muted)' }}>· {section.items.length}</span>
          </div>
          <div className="explore-grid">
            {section.items.map(p => (
              <FounderProjectCard key={p.ticker} project={p} />
            ))}
          </div>
        </section>
      ))}
    </AppLayout>
  );
}
