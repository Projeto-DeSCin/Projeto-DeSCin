import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, XCircle, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { useProjectStore } from '../../stores/project.store';
import { useAuthStore } from '../../stores/auth.store';
import { formatCurrency, formatDate } from '../../utils/format';
import { getProjectGradient } from '../../utils/color';
import { getFormattedDateTime } from '../../utils/briefing';

const GLASS: React.CSSProperties = {
  background: 'rgba(255,255,255,0.32)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(20,20,20,0.08)',
  borderRadius: 20,
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.65), 0 4px 16px rgba(20,20,20,0.05)',
};

function TimelineStep({
  done, active, label, sub,
}: { done?: boolean; active?: boolean; label: string; sub?: string }) {
  const color = done ? '#16a34a' : active ? 'var(--ink-primary)' : 'var(--ink-muted)';
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <div style={{
        width: 24, height: 24, borderRadius: '50%', flexShrink: 0, marginTop: 2,
        background: done ? '#16a34a' : active ? 'var(--ink-primary)' : 'rgba(20,20,20,0.10)',
        border: done ? 'none' : `2px solid ${active ? 'var(--ink-primary)' : 'rgba(20,20,20,0.18)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {done && <CheckCircle size={13} style={{ color: '#fff' }} />}
        {active && !done && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
      </div>
      <div>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: done || active ? 600 : 400, color, marginBottom: 2 }}>{label}</p>
        {sub && <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 11, color: 'var(--ink-muted)' }}>{sub}</p>}
      </div>
    </div>
  );
}

export default function ProjetoDetail() {
  const { ticker }   = useParams<{ ticker: string }>();
  const navigate     = useNavigate();
  const { user, hasRole } = useAuthStore();
  const { projects } = useProjectStore();

  if (!hasRole('founder')) {
    return (
      <AppLayout>
        <div style={{ textAlign: 'center', padding: 96 }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--ink-muted)' }}>
            Acesso restrito a criadores.
          </p>
        </div>
      </AppLayout>
    );
  }

  const project = projects.find(p => p.ticker === `PROJ:${ticker}`);

  if (!project || project.founderId !== user?.id) {
    return (
      <AppLayout>
        <div style={{ textAlign: 'center', padding: 96 }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--ink-muted)' }}>
            Projeto não encontrado.
          </p>
          <button onClick={() => navigate('/founder')} style={{ marginTop: 20, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--red)', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.10em' }}>
            ← Meus projetos
          </button>
        </div>
      </AppLayout>
    );
  }

  const gradient  = getProjectGradient(project.ticker);
  const code      = project.ticker.split(':')[1];
  const isApproved = project.status === 'approved';
  const isPending  = project.status === 'pending';
  const isRejected = project.status === 'rejected';
  const pos        = (project.change24h ?? 0) >= 0;
  const soldPct    = Math.round(((project.totalSupply - project.availableTokens) / project.totalSupply) * 100);

  const lastRejection = project.curationHistory.filter(h => h.action === 'rejected').at(-1);

  return (
    <AppLayout>
      {/* ── Hero ── */}
      <section className="page-s1" style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <Link
            to="/founder"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', textDecoration: 'none', transition: 'color 150ms' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-primary)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-muted)'; }}
          >
            <ArrowLeft size={12} />
            Meus projetos
          </Link>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
            {getFormattedDateTime()}
          </span>
        </div>

        <h1 style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, textTransform: 'uppercase', lineHeight: 0.95, letterSpacing: '-0.025em' }}>
          <span style={{ display: 'block', fontSize: 'clamp(28px, 3.5vw, 52px)', color: 'var(--ink-primary)' }}>{project.name}</span>
          <span style={{ display: 'block', fontSize: 'clamp(18px, 2.2vw, 30px)', color: isApproved ? '#16a34a' : isPending ? '#b45309' : '#dc2626', marginTop: 6 }}>
            {isApproved ? '● No mercado' : isPending ? '◌ Em análise' : '✕ Rejeitado'}
          </span>
        </h1>
      </section>

      {/* ── Content ── */}
      <section className="page-s2" style={{ marginBottom: 60 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Identity */}
            <div style={{ ...GLASS, overflow: 'hidden' }}>
              <div style={{ background: gradient, height: 70, padding: '16px 22px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.06em' }}>{code}</span>
                {isApproved && (
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, color: pos ? '#22c55e' : '#ff6b6b', fontVariantNumeric: 'tabular-nums' }}>
                    {pos ? '+' : ''}{project.change24h.toFixed(1)}%
                  </span>
                )}
              </div>
              <div style={{ padding: '20px 22px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {[
                  { label: 'Universidade', value: project.university },
                  { label: 'Área', value: project.area },
                  { label: 'Submetido', value: formatDate(project.submittedAt) },
                  ...(isApproved ? [
                    { label: 'Aprovado', value: formatDate(project.approvedAt!) },
                    { label: 'Preço atual', value: formatCurrency(project.currentPrice) },
                    { label: 'Market cap', value: `R$ ${(project.marketCap / 1000).toFixed(0)}K` },
                  ] : [
                    { label: 'Preço inicial', value: formatCurrency(project.initialPrice) },
                    { label: 'Supply', value: `${(project.totalSupply / 1000).toFixed(0)}K tokens` },
                    { label: 'Valuation', value: `R$ ${((project.initialPrice * project.totalSupply) / 1000).toFixed(0)}K` },
                  ]),
                ].map(s => (
                  <div key={s.label}>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 3 }}>{s.label}</p>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: 'var(--ink-primary)', fontVariantNumeric: 'tabular-nums' }}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Approved: market stats */}
            {isApproved && (
              <div style={{ ...GLASS, padding: '24px 22px' }}>
                <h3 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 16 }}>
                  Desempenho de mercado
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                  {[
                    { label: 'Preço atual', value: formatCurrency(project.currentPrice), icon: pos ? <TrendingUp size={14} style={{ color: '#22c55e' }} /> : <TrendingDown size={14} style={{ color: '#dc2626' }} /> },
                    { label: 'Variação 24h', value: `${pos ? '+' : ''}${project.change24h.toFixed(2)}%`, accent: pos ? '#22c55e' : '#dc2626' },
                    { label: 'Volume 24h', value: `R$ ${(project.volume24h / 1000).toFixed(1)}K` },
                    { label: 'Holders', value: String(project.holders) },
                    { label: 'Tokens vendidos', value: `${soldPct}%` },
                    { label: 'Market cap', value: `R$ ${(project.marketCap / 1000).toFixed(0)}K` },
                  ].map(s => (
                    <div key={s.label} style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.40)', border: '1px solid var(--rule)' }}>
                      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 4 }}>{s.label}</p>
                      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 700, color: s.accent ?? 'var(--ink-primary)', fontVariantNumeric: 'tabular-nums' }}>{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Progress */}
                <div style={{ marginTop: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.10em' }}>Captação</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, color: 'var(--ink-primary)' }}>{soldPct}%</span>
                  </div>
                  <div style={{ height: 4, background: 'rgba(20,20,20,0.08)', borderRadius: 2 }}>
                    <div style={{ height: '100%', width: `${soldPct}%`, background: 'var(--red)', borderRadius: 2, transition: 'width 0.6s ease' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--ink-muted)' }}>{(project.totalSupply - project.availableTokens).toLocaleString('pt-BR')} tokens vendidos</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--ink-muted)' }}>{project.availableTokens.toLocaleString('pt-BR')} disponíveis</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/projetos/${code}`)}
                  style={{ marginTop: 20, width: '100%', height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12, border: '1.5px solid var(--rule)', background: 'rgba(255,255,255,0.55)', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--ink-primary)', cursor: 'pointer', transition: 'all 150ms ease' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.80)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.55)'; }}
                >
                  Ver página pública do projeto →
                </button>
              </div>
            )}

            {/* Description */}
            <div style={{ ...GLASS, padding: '24px 22px' }}>
              <h3 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 10 }}>
                Descrição
              </h3>
              <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 13, color: 'var(--ink-secondary)', lineHeight: 1.7 }}>
                {project.description}
              </p>
              {project.descriptionLong && (
                <>
                  <div style={{ height: 1, background: 'var(--rule)', margin: '16px 0' }} />
                  <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 13, color: 'var(--ink-secondary)', lineHeight: 1.75, whiteSpace: 'pre-line' }}>
                    {project.descriptionLong}
                  </p>
                </>
              )}
            </div>

            {/* Team */}
            {project.team.length > 0 && (
              <div style={{ ...GLASS, padding: '24px 22px' }}>
                <h3 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 14 }}>
                  Equipe
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {project.team.map((m, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.40)', border: '1px solid var(--rule)' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>{m.name[0]}</span>
                      </div>
                      <div>
                        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: 'var(--ink-primary)' }}>{m.name}</p>
                        <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 11, color: 'var(--ink-muted)' }}>{m.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right sidebar ── */}
          <aside style={{ position: 'sticky', top: 108, display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Pending: timeline */}
            {isPending && (
              <div style={{ ...GLASS, padding: '22px 20px' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: 18 }}>
                  Status
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {[
                    { done: true, label: 'Submetido', sub: formatDate(project.submittedAt) },
                    { done: true, active: false, label: 'Na fila de curadoria', sub: 'Aguardando avaliação' },
                    { done: false, active: true, label: 'Em análise', sub: 'Estimativa: até 48h' },
                    { done: false, active: false, label: 'Decisão', sub: 'Aprovado ou ajustes solicitados' },
                  ].map((item, i, arr) => (
                    <div key={item.label}>
                      <TimelineStep {...item} />
                      {i < arr.length - 1 && (
                        <div style={{ width: 1, height: 20, background: 'var(--rule)', marginLeft: 11, marginTop: 4, marginBottom: 4 }} />
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 20, padding: '12px 14px', borderRadius: 12, background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.20)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Clock size={12} style={{ color: '#b45309' }} />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.10em', color: '#b45309' }}>Em análise</span>
                  </div>
                  <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 12, color: 'var(--ink-secondary)' }}>
                    Projetos são revisados em até 48 horas por nosso time de curadores.
                  </p>
                </div>
              </div>
            )}

            {/* Approved: quick stats */}
            {isApproved && (
              <div style={{ ...GLASS, padding: '22px 20px' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: 14 }}>
                  Ao vivo
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse-live 2s ease-in-out infinite' }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#16a34a', fontWeight: 600 }}>Ativo no mercado</span>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 32, fontWeight: 700, color: 'var(--ink-primary)', fontVariantNumeric: 'tabular-nums', marginBottom: 4 }}>
                  {formatCurrency(project.currentPrice)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
                  {pos ? <TrendingUp size={13} style={{ color: '#22c55e' }} /> : <TrendingDown size={13} style={{ color: '#dc2626' }} />}
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: pos ? '#22c55e' : '#dc2626', fontVariantNumeric: 'tabular-nums' }}>
                    {pos ? '+' : ''}{project.change24h.toFixed(2)}% 24h
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 16, borderTop: '1px solid var(--rule)' }}>
                  {[
                    { label: 'Volume 24h', value: `R$ ${(project.volume24h / 1000).toFixed(1)}K` },
                    { label: 'Holders', value: String(project.holders) },
                    { label: 'Aprovado em', value: formatDate(project.approvedAt!) },
                  ].map(s => (
                    <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.10em' }}>{s.label}</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--ink-primary)' }}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rejected: reason + resubmit */}
            {isRejected && (
              <div style={{ ...GLASS, padding: '22px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <XCircle size={15} style={{ color: '#dc2626' }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.10em', color: '#dc2626' }}>Rejeitado</span>
                </div>
                {lastRejection && (
                  <div style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(229,37,26,0.07)', border: '1px solid rgba(229,37,26,0.18)', marginBottom: 16 }}>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: 6 }}>
                      Motivo · {formatDate(lastRejection.createdAt)}
                    </p>
                    <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 12, color: 'var(--ink-secondary)', lineHeight: 1.6 }}>
                      {lastRejection.reason}
                    </p>
                  </div>
                )}
                <button
                  onClick={() => navigate('/criar-projeto')}
                  style={{ width: '100%', height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12, border: 'none', background: 'var(--ink-primary)', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--bg-form)', cursor: 'pointer', boxShadow: '0 4px 14px rgba(10,10,10,0.18)', transition: 'all 150ms' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <RefreshCw size={13} />
                  Revisar e resubmeter
                </button>
                <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 11, color: 'var(--ink-muted)', textAlign: 'center', marginTop: 10 }}>
                  Corrija os pontos levantados e envie novamente para curadoria.
                </p>
              </div>
            )}

            {/* Tokenomics quick view */}
            <div style={{ ...GLASS, padding: '20px' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: 12 }}>
                Tokenomics
              </span>
              <div style={{ height: 6, borderRadius: 3, overflow: 'hidden', display: 'flex', gap: 2, marginBottom: 10 }}>
                {[
                  { pct: project.tokenomics.founders, color: '#6366f1' },
                  { pct: project.tokenomics.community, color: '#22c55e' },
                  { pct: project.tokenomics.liquidity, color: '#3b82f6' },
                  { pct: project.tokenomics.reserve, color: '#f59e0b' },
                ].map((s, i) => s.pct > 0 ? (
                  <div key={i} style={{ flex: s.pct, background: s.color, borderRadius: 3, minWidth: 2 }} />
                ) : null)}
              </div>
              {[
                { label: 'Founders', pct: project.tokenomics.founders, color: '#6366f1' },
                { label: 'Community', pct: project.tokenomics.community, color: '#22c55e' },
                { label: 'Liquidez', pct: project.tokenomics.liquidity, color: '#3b82f6' },
                { label: 'Reserva', pct: project.tokenomics.reserve, color: '#f59e0b' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 7, height: 7, borderRadius: 2, background: s.color, display: 'inline-block' }} />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--ink-muted)' }}>{s.label}</span>
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--ink-primary)' }}>{s.pct}%</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </AppLayout>
  );
}
