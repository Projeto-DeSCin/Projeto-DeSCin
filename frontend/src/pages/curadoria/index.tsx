import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, Eye, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { useProjectStore } from '../../stores/project.store';
import { useProjectsStore } from '../../stores/projects.store';
import { useAuthStore } from '../../stores/auth.store';
import { useNotificationStore } from '../../stores/notification.store';
import { toast } from '../../components/ui/Toast';
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

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div style={{ ...GLASS, padding: '20px 24px' }}>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 8 }}>{label}</p>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 700, color: color ?? 'var(--ink-primary)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{value}</p>
      {sub && <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--ink-muted)', marginTop: 4 }}>{sub}</p>}
    </div>
  );
}

// ─── Reject reason modal ──────────────────────────────────────────────────────
function RejectModal({ project, onConfirm, onClose }: {
  project: LiveProject;
  onConfirm: (reason: string) => void;
  onClose: () => void;
}) {
  const [reason, setReason] = useState('');
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(10,10,10,0.55)', backdropFilter: 'blur(16px)' }} onClick={onClose}>
      <div style={{ width: '100%', maxWidth: 480, background: 'rgba(248,248,245,0.96)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.50)', boxShadow: '0 32px 80px rgba(10,10,10,0.24)', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '22px 24px 18px', borderBottom: '1px solid rgba(20,20,20,0.07)' }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: 4 }}>Rejeitar projeto</p>
          <h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, fontWeight: 600, color: 'var(--ink-primary)' }}>{project.name}</h2>
        </div>
        <div style={{ padding: '20px 24px' }}>
          <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: 8 }}>
            Motivo da rejeição *
          </label>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Descreva os problemas encontrados no projeto..."
            rows={4}
            style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid var(--rule)', background: 'rgba(255,255,255,0.60)', fontFamily: "'Geist', sans-serif", fontSize: 13, color: 'var(--ink-primary)', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
            onFocus={e => { (e.target as HTMLTextAreaElement).style.borderColor = 'var(--ink-primary)'; }}
            onBlur={e => { (e.target as HTMLTextAreaElement).style.borderColor = 'var(--rule)'; }}
          />
        </div>
        <div style={{ padding: '0 24px 24px', display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, height: 44, borderRadius: 10, border: '1.5px solid rgba(20,20,20,0.12)', background: 'transparent', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--ink-secondary)', cursor: 'pointer' }}>
            Cancelar
          </button>
          <button
            onClick={() => reason.trim() && onConfirm(reason.trim())}
            disabled={!reason.trim()}
            style={{ flex: 2, height: 44, borderRadius: 10, border: 'none', background: reason.trim() ? 'var(--red)' : 'rgba(229,37,26,0.30)', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#fff', cursor: reason.trim() ? 'pointer' : 'not-allowed' }}
          >
            Confirmar Rejeição
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Project review card ──────────────────────────────────────────────────────
function ProjectCard({ project, onApprove, onReject }: {
  project: LiveProject;
  onApprove: () => void;
  onReject: () => void;
}) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const gradient = getProjectGradient(project.ticker);
  const code = project.ticker.split(':')[1];

  return (
    <div style={{ ...GLASS, overflow: 'hidden' }}>
      {/* Header strip */}
      <div style={{ background: gradient, height: 8 }} />

      <div style={{ padding: '20px 24px' }}>
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--ink-muted)' }}>{code}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, padding: '2px 7px', borderRadius: 4, background: 'rgba(234,179,8,0.12)', border: '1px solid rgba(234,179,8,0.25)', color: '#b45309', letterSpacing: '0.10em', textTransform: 'uppercase', fontWeight: 600 }}>
                Em análise
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--ink-muted)' }}>{project.area}</span>
            </div>
            <h3 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em', color: 'var(--ink-primary)', marginBottom: 4 }}>
              {project.name}
            </h3>
            <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 12, color: 'var(--ink-secondary)' }}>
              {project.university} · Submetido em {formatDate(project.submittedAt)}
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 20, flexShrink: 0, marginLeft: 24 }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 2 }}>Preço inicial</p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, fontWeight: 700, color: 'var(--ink-primary)', fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(project.initialPrice)}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 2 }}>Supply total</p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, fontWeight: 700, color: 'var(--ink-primary)', fontVariantNumeric: 'tabular-nums' }}>{(project.totalSupply / 1000).toFixed(0)}K</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 13, color: 'var(--ink-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
          {project.description}
        </p>

        {/* Tokenomics bar */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            {Object.entries(project.tokenomics).map(([k, v]) => (
              <span key={k} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--ink-muted)' }}>
                {k}: <strong style={{ color: 'var(--ink-primary)' }}>{v}%</strong>
              </span>
            ))}
          </div>
          <div style={{ height: 4, borderRadius: 2, overflow: 'hidden', display: 'flex', gap: 2 }}>
            {[
              { pct: project.tokenomics.founders, color: '#6366f1' },
              { pct: project.tokenomics.community, color: '#22c55e' },
              { pct: project.tokenomics.liquidity, color: '#3b82f6' },
              { pct: project.tokenomics.reserve, color: '#f59e0b' },
            ].map((s, i) => (
              <div key={i} style={{ flex: s.pct, background: s.color, borderRadius: 2, minWidth: 2 }} />
            ))}
          </div>
        </div>

        {/* Expand details */}
        {expanded && (
          <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 16, marginBottom: 16 }}>
            {project.descriptionLong && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 8 }}>Descrição completa</p>
                <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 13, color: 'var(--ink-secondary)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{project.descriptionLong}</p>
              </div>
            )}
            {project.team.length > 0 && (
              <div>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 8 }}>Equipe</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {project.team.map((m, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>{m.name[0]}</span>
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
        )}

        {/* Action row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => navigate(`/curadoria/${code}`)}
            style={{ flex: 2, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12, border: '1.5px solid rgba(20,20,20,0.14)', background: 'rgba(255,255,255,0.55)', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--ink-primary)', cursor: 'pointer', transition: 'all 150ms ease' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.80)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.55)'; }}
          >
            <Eye size={14} />
            Revisar em detalhe
          </button>

          <button
            onClick={onApprove}
            style={{ flex: 1, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12, border: '1.5px solid rgba(34,197,94,0.30)', background: 'rgba(34,197,94,0.10)', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#16a34a', cursor: 'pointer', transition: 'all 150ms ease' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(34,197,94,0.18)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(34,197,94,0.10)'; }}
          >
            <CheckCircle size={14} />
            Aprovar
          </button>

          <button
            onClick={onReject}
            style={{ flex: 1, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12, border: '1.5px solid rgba(229,37,26,0.25)', background: 'rgba(229,37,26,0.08)', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--red)', cursor: 'pointer', transition: 'all 150ms ease' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(229,37,26,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(229,37,26,0.08)'; }}
          >
            <XCircle size={14} />
            Rejeitar
          </button>

          <button
            onClick={() => navigate(`/projetos/${code}`)}
            style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, border: '1.5px solid var(--rule)', background: 'rgba(255,255,255,0.50)', color: 'var(--ink-muted)', cursor: 'pointer', transition: 'all 150ms ease', flexShrink: 0 }}
            title="Ver página do projeto"
          >
            <ExternalLink size={14} />
          </button>

          <button
            onClick={() => setExpanded(v => !v)}
            style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, border: '1.5px solid var(--rule)', background: 'rgba(255,255,255,0.50)', color: 'var(--ink-muted)', cursor: 'pointer', transition: 'all 150ms ease', flexShrink: 0 }}
            title={expanded ? 'Recolher' : 'Ver mais detalhes'}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Curadoria() {
  const { fetch: fetchProjects, projects: apiProjects } = useProjectsStore();
  
  // Busca projetos da API ao carregar
  const [loaded, setLoaded] = useState(false);
  if (!loaded) {
    setLoaded(true);
    fetchProjects();
  }
  const { user, hasRole } = useAuthStore();
  const { projects: localProjects, approveProject, rejectProject, addProject } = useProjectStore();
  
  // Merge API projects into local store
  const allProjects = [...localProjects];
  apiProjects.forEach(ap => {
    if (!allProjects.find(p => p.name === ap.name)) {
      addProject(ap as any);
    }
  });
  const projects = allProjects;
  const push = useNotificationStore(s => s.push);
  const navigate = useNavigate();

  const [rejectTarget, setRejectTarget] = useState<LiveProject | null>(null);

  if (!hasRole('curator')) {
    return (
      <AppLayout>
        <div style={{ textAlign: 'center', padding: '96px 24px' }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--ink-muted)' }}>
            Acesso restrito a curadores.
          </p>
        </div>
      </AppLayout>
    );
  }

  const pending  = projects.filter(p => p.status === 'pending');
  const approved = projects.filter(p => p.status === 'approved');
  const rejected = projects.filter(p => p.status === 'rejected');

  const handleApprove = (project: LiveProject) => {
    if (!user) return;
    approveProject(project.ticker, user.id, user.name);
    push({ type: 'approved', title: 'Projeto aprovado', message: `${project.name} agora está no mercado.` });
    toast('success', `${project.name} aprovado e publicado no mercado!`, 'Aprovado');
  };

  const handleReject = (project: LiveProject, reason: string) => {
    if (!user) return;
    rejectProject(project.ticker, user.id, user.name, reason);
    push({ type: 'rejected', title: 'Projeto rejeitado', message: `${project.name} foi rejeitado.` });
    toast('info', `${project.name} rejeitado.`, 'Rejeitado');
    setRejectTarget(null);
  };

  return (
    <AppLayout>
      {/* Hero */}
      <section className="page-s1" style={{ marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid var(--rule)' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: 16 }}>
          {getFormattedDateTime()}
        </span>
        <h1 style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, textTransform: 'uppercase', lineHeight: 0.95, letterSpacing: '-0.025em' }}>
          <span style={{ display: 'block', fontSize: 'clamp(36px, 4.5vw, 64px)', color: 'var(--ink-primary)' }}>Fila de</span>
          <span style={{ display: 'block', fontSize: 'clamp(36px, 4.5vw, 64px)', color: 'var(--red)' }}>aprovação.</span>
        </h1>
      </section>

      {/* Stats */}
      <section className="page-s2" style={{ marginBottom: 32 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <StatCard label="Aguardando revisão" value={pending.length} sub="projetos pendentes" color={pending.length > 0 ? '#b45309' : 'var(--ink-primary)'} />
          <StatCard label="Aprovados" value={approved.length} sub="no mercado" color="#16a34a" />
          <StatCard label="Rejeitados" value={rejected.length} sub="arquivados" color="var(--red)" />
        </div>
      </section>

      {/* Pending queue */}
      <section className="page-s3">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: 4 }}>
              Para revisar
            </span>
            <h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 24, fontWeight: 600, color: 'var(--ink-primary)' }}>
              {pending.length === 0 ? 'Fila vazia' : `${pending.length} projeto${pending.length !== 1 ? 's' : ''}`}
            </h2>
          </div>
          {pending.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={12} style={{ color: '#b45309' }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#b45309', fontWeight: 600 }}>Aguardando revisão</span>
            </div>
          )}
        </div>

        {pending.length === 0 ? (
          <div style={{ ...GLASS, padding: '64px 24px', textAlign: 'center' }}>
            <Eye size={28} style={{ color: 'var(--ink-muted)', marginBottom: 12 }} />
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--ink-muted)' }}>
              Nenhum projeto aguardando revisão.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {pending.map(project => (
              <ProjectCard
                key={project.ticker}
                project={project}
                onApprove={() => handleApprove(project)}
                onReject={() => setRejectTarget(project)}
              />
            ))}
          </div>
        )}
      </section>

      {/* History: recently approved/rejected */}
      {(approved.length > 0 || rejected.length > 0) && (
        <section className="page-s4" style={{ marginTop: 48 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: 16 }}>
            Histórico de decisões
          </span>
          <div style={{ ...GLASS, overflow: 'hidden' }}>
            {[...approved, ...rejected]
              .sort((a, b) => {
                const aDate = a.approvedAt ?? a.submittedAt;
                const bDate = b.approvedAt ?? b.submittedAt;
                return new Date(bDate).getTime() - new Date(aDate).getTime();
              })
              .slice(0, 10)
              .map((p, i, arr) => {
                const code = p.ticker.split(':')[1];
                const last = p.curationHistory[p.curationHistory.length - 1];
                return (
                  <div
                    key={p.ticker}
                    style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, padding: '14px 24px', borderBottom: i < arr.length - 1 ? '1px solid rgba(20,20,20,0.05)' : 'none', alignItems: 'center', cursor: 'pointer', transition: 'background 150ms' }}
                    onClick={() => navigate(`/projetos/${code}`)}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.45)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <div>
                      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: 'var(--ink-primary)' }}>{code}</p>
                      <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 11, color: 'var(--ink-muted)' }}>{p.name}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {last && (
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--ink-muted)' }}>
                          {formatDate(last.createdAt)}
                        </span>
                      )}
                      <span style={{ padding: '3px 8px', borderRadius: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', background: p.status === 'approved' ? 'rgba(34,197,94,0.12)' : 'rgba(229,37,26,0.10)', color: p.status === 'approved' ? '#16a34a' : 'var(--red)', border: `1px solid ${p.status === 'approved' ? 'rgba(34,197,94,0.25)' : 'rgba(229,37,26,0.20)'}` }}>
                        {p.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      )}

      {/* Reject modal */}
      {rejectTarget && (
        <RejectModal
          project={rejectTarget}
          onConfirm={(reason) => handleReject(rejectTarget, reason)}
          onClose={() => setRejectTarget(null)}
        />
      )}
    </AppLayout>
  );
}
