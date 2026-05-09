import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LayoutGrid, List } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { useProjects } from '../hooks/useProjects';
import { getSparklineForTicker } from '../mocks/data';
import { getProjectGradient } from '../utils/color';
import { formatCurrency } from '../utils/format';
import { getFormattedDateTime } from '../utils/briefing';
import type { Area, Project } from '../types';

// ─── Types ──────────────────────────────────────────────────────────────────
type SortKey = 'volume' | 'alta24h' | 'queda24h' | 'recentes' | 'preco_asc' | 'preco_desc';
type ViewMode = 'grid' | 'list';

const AREAS: Area[] = ['Todas', 'Tecnologia', 'Saúde', 'Engenharia', 'Sustentabilidade', 'Humanas', 'Ciências'];

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'volume',    label: 'Volume'            },
  { value: 'alta24h',   label: 'Maior alta 24h'    },
  { value: 'queda24h',  label: 'Maior queda 24h'   },
  { value: 'recentes',  label: 'Mais recentes'     },
  { value: 'preco_asc', label: 'Preço crescente'   },
  { value: 'preco_desc',label: 'Preço decrescente' },
];

function sortFn(key: SortKey) {
  return (a: Project, b: Project): number => {
    if (key === 'volume')    return b.volume - a.volume;
    if (key === 'alta24h')   return b.change24h - a.change24h;
    if (key === 'queda24h')  return a.change24h - b.change24h;
    if (key === 'recentes')  return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    if (key === 'preco_asc') return a.currentPrice - b.currentPrice;
    return b.currentPrice - a.currentPrice;
  };
}

function fmtCompact(n: number): string {
  if (n >= 1_000_000) return `R$ ${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `R$ ${(n / 1_000).toFixed(0)}K`;
  return formatCurrency(n);
}

// ─── Mini SVG sparkline ──────────────────────────────────────────────────────
function Spark({ data, positive, height = 52 }: { data: number[]; positive: boolean; height?: number }) {
  if (data.length < 2) return null;
  const W = 200, H = height;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) =>
    `${((i / (data.length - 1)) * W).toFixed(1)},${(H - ((v - min) / range) * H * 0.85).toFixed(1)}`
  ).join(' ');
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: 'block', height }}>
      <polyline points={pts} fill="none" stroke={positive ? '#22c55e' : 'var(--red)'}
        strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ─── Stat block ──────────────────────────────────────────────────────────────
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 3 }}>
        {label}
      </div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: 'var(--ink-primary)', fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </div>
    </div>
  );
}

// ─── Mover card (horizontal strip) ───────────────────────────────────────────
function MoverCard({ project }: { project: Project }) {
  const navigate = useNavigate();
  const code = project.ticker.split(':')[1];
  const spark = getSparklineForTicker(project.ticker);
  const pos = project.change24h >= 0;

  return (
    <div
      onClick={() => navigate(`/projetos/${code}`)}
      style={{
        width: 240, flexShrink: 0, cursor: 'pointer',
        background: 'rgba(255,255,255,0.32)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(20,20,20,0.08)',
        borderRadius: 16,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.65), 0 4px 12px rgba(20,20,20,0.05)',
        overflow: 'hidden',
        transition: 'transform 220ms ease, box-shadow 220ms ease',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = 'translateY(-2px)';
        el.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.70), 0 8px 24px rgba(20,20,20,0.09)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.65), 0 4px 12px rgba(20,20,20,0.05)';
      }}
    >
      <div style={{ padding: '14px 16px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--ink-primary)' }}>{code}</span>
        <div style={{ padding: '3px 8px', borderRadius: 5, background: pos ? 'rgba(34,197,94,0.10)' : 'rgba(229,37,26,0.08)', border: `1px solid ${pos ? 'rgba(34,197,94,0.18)' : 'rgba(229,37,26,0.14)'}` }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: pos ? '#22c55e' : 'var(--red)', fontVariantNumeric: 'tabular-nums' }}>
            {pos ? '+' : ''}{project.change24h.toFixed(1)}%
          </span>
        </div>
      </div>
      <div style={{ height: 52, opacity: 0.75 }}>
        <Spark data={spark} positive={pos} height={52} />
      </div>
      <div style={{ padding: '8px 16px 14px' }}>
        <div style={{ fontFamily: "'Geist', sans-serif", fontSize: 11, color: 'var(--ink-secondary)', marginBottom: 2, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {project.name}
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 600, color: 'var(--ink-primary)', fontVariantNumeric: 'tabular-nums' }}>
          R$ {project.currentPrice.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

// ─── Project grid card ────────────────────────────────────────────────────────
function ProjectGridCard({ project, delay = 0 }: { project: Project; delay?: number }) {
  const navigate = useNavigate();
  const code = project.ticker.split(':')[1];
  const spark = getSparklineForTicker(project.ticker);
  const gradient = getProjectGradient(project.ticker);
  const pos = project.change24h >= 0;
  const soldPct = Math.round(((project.totalSupply - project.availableTokens) / project.totalSupply) * 100);

  return (
    <div
      onClick={() => navigate(`/projetos/${code}`)}
      className="page-enter"
      style={{
        cursor: 'pointer', animationDelay: `${delay}ms`,
        background: 'rgba(255,255,255,0.32)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(20,20,20,0.08)',
        borderRadius: 20,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.65), 0 4px 16px rgba(20,20,20,0.05)',
        overflow: 'hidden',
        transition: 'transform 220ms ease, box-shadow 220ms ease',
        display: 'flex', flexDirection: 'column',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = 'translateY(-2px)';
        el.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.70), 0 12px 32px rgba(20,20,20,0.10)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.65), 0 4px 16px rgba(20,20,20,0.05)';
      }}
    >
      {/* Gradient header */}
      <div style={{ background: gradient, height: 140, position: 'relative', padding: '14px 18px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{ padding: '3px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.16)', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)' }}>
              {project.area}
            </span>
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: pos ? '#22c55e' : '#ff6b6b' }}>
            {pos ? '+' : ''}{project.change24h.toFixed(1)}%
          </span>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 56, opacity: 0.6 }}>
          <Spark data={spark} positive={pos} height={56} />
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: '16px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--ink-muted)', letterSpacing: '0.08em' }}>{project.ticker}</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--ink-muted)', letterSpacing: '0.06em' }}>{project.university}</span>
        </div>
        <h3 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, letterSpacing: '0.02em', textTransform: 'uppercase', color: 'var(--ink-primary)', marginBottom: 8, lineHeight: 1.3 }}>
          {project.name}
        </h3>
        <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 12, color: 'var(--ink-secondary)', lineHeight: 1.6, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {project.description}
        </p>

        <div style={{ flex: 1 }} />

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, paddingTop: 12, borderTop: '1px solid var(--rule)', marginBottom: 10 }}>
          <Stat label="Preço"  value={`R$ ${project.currentPrice.toFixed(2)}`} />
          <Stat label="Volume" value={fmtCompact(project.volume)} />
          <Stat label="Vendido" value={`${soldPct}%`} />
        </div>

        {/* Progress bar */}
        <div style={{ height: 3, background: 'rgba(20,20,20,0.08)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${soldPct}%`, background: 'var(--ink-primary)', borderRadius: 2 }} />
        </div>
      </div>
    </div>
  );
}

// ─── Project list row ─────────────────────────────────────────────────────────
function ProjectListRow({ project, isLast }: { project: Project; isLast: boolean }) {
  const navigate = useNavigate();
  const code = project.ticker.split(':')[1];
  const pos = project.change24h >= 0;
  const soldPct = Math.round(((project.totalSupply - project.availableTokens) / project.totalSupply) * 100);

  return (
    <div
      onClick={() => navigate(`/projetos/${code}`)}
      style={{
        display: 'grid', gridTemplateColumns: '2fr 1fr auto auto auto 120px',
        gap: 16, padding: '0 24px', height: 64, alignItems: 'center',
        borderBottom: isLast ? 'none' : '1px solid rgba(20,20,20,0.05)',
        cursor: 'pointer', transition: 'background 150ms ease',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.45)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
    >
      {/* Ativo */}
      <div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: 'var(--ink-primary)', letterSpacing: '0.02em' }}>{code}</div>
        <div style={{ fontFamily: "'Geist', sans-serif", fontSize: 11, color: 'var(--ink-muted)', marginTop: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{project.name}</div>
      </div>
      {/* Universidade */}
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--ink-secondary)' }}>{project.university}</span>
      {/* Preço */}
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, color: 'var(--ink-primary)', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>
        R$ {project.currentPrice.toFixed(2)}
      </span>
      {/* 24h */}
      <div style={{ padding: '3px 8px', borderRadius: 5, background: pos ? 'rgba(34,197,94,0.10)' : 'rgba(229,37,26,0.08)', border: `1px solid ${pos ? 'rgba(34,197,94,0.18)' : 'rgba(229,37,26,0.14)'}`, textAlign: 'center' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: pos ? '#22c55e' : 'var(--red)', fontVariantNumeric: 'tabular-nums' }}>
          {pos ? '+' : ''}{project.change24h.toFixed(1)}%
        </span>
      </div>
      {/* Volume */}
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--ink-primary)', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>
        {fmtCompact(project.volume)}
      </span>
      {/* Captação */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--ink-muted)' }}>Captação</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, color: 'var(--ink-primary)' }}>{soldPct}%</span>
        </div>
        <div style={{ height: 3, background: 'rgba(20,20,20,0.08)', borderRadius: 2 }}>
          <div style={{ height: '100%', width: `${soldPct}%`, background: 'var(--ink-primary)', borderRadius: 2 }} />
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Explorar() {
  const { projects, loading } = useProjects();
  const [search, setSearch]       = useState('');
  const [area, setArea]           = useState<Area>('Todas');
  const [university, setUniversity] = useState('all');
  const [sortBy, setSortBy]       = useState<SortKey>('volume');
  const [viewMode, setViewMode]   = useState<ViewMode>('grid');

  const approved = useMemo(() => projects.filter(p => p.status === 'approved'), [projects]);

  const universities = useMemo(() => {
    const uniq = [...new Set(approved.map(p => p.university))].sort();
    return ['all', ...uniq];
  }, [approved]);

  const movers = useMemo(() =>
    [...approved].sort((a, b) => Math.abs(b.change24h) - Math.abs(a.change24h)).slice(0, 6),
  [approved]);

  const filtered = useMemo(() => {
    let r = approved;
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.ticker.toLowerCase().includes(q) ||
        p.university.toLowerCase().includes(q)
      );
    }
    if (area !== 'Todas')  r = r.filter(p => p.area === area);
    if (university !== 'all') r = r.filter(p => p.university === university);
    return [...r].sort(sortFn(sortBy));
  }, [approved, search, area, university, sortBy]);

  const clearFilters = () => { setSearch(''); setArea('Todas'); setUniversity('all'); };

  const GLASS: React.CSSProperties = {
    background: 'rgba(255,255,255,0.32)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(20,20,20,0.08)',
    borderRadius: 20,
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.65), 0 4px 16px rgba(20,20,20,0.05)',
  };

  return (
    <AppLayout>
      {/* ── Section 1: Hero editorial ── */}
      <section className="page-s1" style={{ marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid var(--rule)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
            {getFormattedDateTime()}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span className="live-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--red)', boxShadow: '0 0 6px var(--red-glow)' }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-secondary)' }}>
              Ao vivo
            </span>
          </div>
        </div>
        <h1 style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, textTransform: 'uppercase', lineHeight: 0.95, letterSpacing: '-0.025em' }}>
          <span style={{ display: 'block', fontSize: 'clamp(38px, 5.2vw, 76px)', color: 'var(--ink-primary)' }}>Descubra</span>
          <span style={{ display: 'block', fontSize: 'clamp(38px, 5.2vw, 76px)', color: 'var(--red)' }}>o próximo ativo.</span>
        </h1>
      </section>

      {/* ── Section 2: Filter bar ── */}
      <section className="page-s2" style={{ marginBottom: 20 }}>
        <div style={{ ...GLASS, padding: '16px 20px' }}>
          {/* Search + sort row */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
            {/* Search input */}
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-muted)', pointerEvents: 'none' }} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por nome, ticker ou universidade..."
                style={{
                  width: '100%', height: 44, paddingLeft: 40, paddingRight: 14,
                  background: 'rgba(255,255,255,0.55)', border: '1.5px solid var(--rule)',
                  borderRadius: 10, outline: 'none', fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12, color: 'var(--ink-primary)', transition: 'border-color 150ms ease',
                }}
                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--ink-primary)'; }}
                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--rule)'; }}
              />
            </div>
            {/* University select */}
            <select
              value={university}
              onChange={e => setUniversity(e.target.value)}
              style={{ height: 44, padding: '0 12px', background: 'rgba(255,255,255,0.55)', border: '1.5px solid var(--rule)', borderRadius: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--ink-secondary)', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.06em', outline: 'none' }}
            >
              <option value="all">Todas universidades</option>
              {universities.filter(u => u !== 'all').map(u => <option key={u} value={u}>{u}</option>)}
            </select>
            {/* Sort select */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortKey)}
              style={{ height: 44, padding: '0 12px', background: 'rgba(255,255,255,0.55)', border: '1.5px solid var(--rule)', borderRadius: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--ink-secondary)', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.06em', outline: 'none' }}
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Area chips */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }} className="scrollbar-hide">
            {AREAS.map(a => (
              <button
                key={a}
                onClick={() => setArea(a)}
                style={{
                  flexShrink: 0, padding: '7px 14px', borderRadius: 9999,
                  border: `1.5px solid ${area === a ? 'var(--ink-primary)' : 'var(--rule)'}`,
                  background: area === a ? 'var(--ink-primary)' : 'transparent',
                  color: area === a ? 'var(--bg-form)' : 'var(--ink-secondary)',
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600,
                  letterSpacing: '0.10em', textTransform: 'uppercase', cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
                onMouseEnter={(e) => { if (area !== a) (e.currentTarget as HTMLElement).style.borderColor = 'var(--ink-primary)'; }}
                onMouseLeave={(e) => { if (area !== a) (e.currentTarget as HTMLElement).style.borderColor = 'var(--rule)'; }}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Movers strip ── */}
      {!loading && movers.length > 0 && (
        <section className="page-s3" style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
              Em destaque hoje
            </span>
          </div>
          <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 4 }} className="scrollbar-hide">
            {movers.map(p => <MoverCard key={p.ticker} project={p} />)}
          </div>
        </section>
      )}

      {/* ── Section 4: Grid/list header + toggle ── */}
      <section className="page-s4">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: 4 }}>
              Todos os ativos
            </span>
            <h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', textTransform: 'uppercase', color: 'var(--ink-primary)', lineHeight: 1 }}>
              {loading ? '—' : `${filtered.length} projeto${filtered.length !== 1 ? 's' : ''}`}
            </h2>
          </div>
          {/* Grid/list toggle */}
          <div style={{ display: 'flex', gap: 2, padding: 3, borderRadius: 10, background: 'rgba(255,255,255,0.40)', border: '1px solid var(--rule)' }}>
            {([['grid', LayoutGrid], ['list', List]] as const).map(([mode, Icon]) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as ViewMode)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 32, height: 32, borderRadius: 7, border: 'none', cursor: 'pointer',
                  background: viewMode === mode ? 'rgba(255,255,255,0.85)' : 'transparent',
                  color: viewMode === mode ? 'var(--ink-primary)' : 'var(--ink-muted)',
                  boxShadow: viewMode === mode ? '0 1px 4px rgba(20,20,20,0.10)' : 'none',
                  transition: 'all 180ms ease',
                }}
              >
                <Icon size={14} />
              </button>
            ))}
          </div>
        </div>

        {/* Loading skeleton */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ height: 360, borderRadius: 20, background: 'linear-gradient(90deg, rgba(20,20,20,0.06) 0%, rgba(20,20,20,0.10) 50%, rgba(20,20,20,0.06) 100%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s ease-in-out infinite' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          /* Empty state */
          <div style={{ padding: '64px 24px', textAlign: 'center' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 12 }}>
              Nenhum resultado
            </div>
            <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 14, color: 'var(--ink-secondary)', maxWidth: 380, margin: '0 auto' }}>
              Tente{' '}
              <button onClick={clearFilters} style={{ color: 'var(--red)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 4, fontFamily: 'inherit', fontSize: 'inherit' }}>
                limpar os filtros
              </button>
              {' '}ou buscar por outro termo.
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid view */
          <div className="explore-grid">
            {filtered.map((project, i) => (
              <ProjectGridCard key={project.ticker} project={project} delay={i * 50} />
            ))}
          </div>
        ) : (
          /* List view */
          <div style={{ ...GLASS, overflow: 'hidden' }}>
            {/* Column headers */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto auto auto 120px', gap: 16, padding: '10px 24px', borderBottom: '1px solid rgba(20,20,20,0.06)' }}>
              {['Ativo', 'Universidade', 'Preço', '24h', 'Volume', 'Captação'].map(col => (
                <span key={col} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', textAlign: col === 'Preço' || col === 'Volume' ? 'right' : 'left' }}>
                  {col}
                </span>
              ))}
            </div>
            {filtered.map((project, i) => (
              <ProjectListRow key={project.ticker} project={project} isLast={i === filtered.length - 1} />
            ))}
          </div>
        )}
      </section>
    </AppLayout>
  );
}
