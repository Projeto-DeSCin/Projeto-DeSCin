import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle, XCircle, MessageSquare, Check, AlertTriangle,
} from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { useProjectStore } from '../../stores/project.store';
import { useAuthStore } from '../../stores/auth.store';
import { useNotificationStore } from '../../stores/notification.store';
import { toast } from '../../components/ui/Toast';
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

type Decision = 'approve' | 'changes_requested' | 'reject' | null;

const DECISION_CONFIG = {
  approve: {
    icon: CheckCircle,
    label: 'Aprovar',
    sub: 'Projeto entra no mercado imediatamente',
    color: '#16a34a',
    bg: 'rgba(34,197,94,0.10)',
    border: 'rgba(34,197,94,0.28)',
    btnBg: 'rgba(22,163,74,0.88)',
    btnLabel: 'Confirmar aprovação',
    placeholder: 'Parabéns pelo projeto! Descreva o que motivou a aprovação...',
  },
  changes_requested: {
    icon: MessageSquare,
    label: 'Pedir ajustes',
    sub: 'Devolve ao criador para revisão',
    color: '#b45309',
    bg: 'rgba(234,179,8,0.10)',
    border: 'rgba(234,179,8,0.28)',
    btnBg: 'rgba(180,83,9,0.88)',
    btnLabel: 'Enviar pedido de ajustes',
    placeholder: 'Descreva claramente o que precisa ser ajustado antes da aprovação...',
  },
  reject: {
    icon: XCircle,
    label: 'Rejeitar',
    sub: 'Projeto não entra no mercado',
    color: '#dc2626',
    bg: 'rgba(229,37,26,0.08)',
    border: 'rgba(229,37,26,0.25)',
    btnBg: 'rgba(185,28,28,0.90)',
    btnLabel: 'Confirmar rejeição',
    placeholder: 'Explique o motivo da rejeição com clareza e objetividade...',
  },
} as const;

const CHECKLIST_ITEMS = [
  { id: 'description', label: 'Descrição adequada e completa' },
  { id: 'tokenomics', label: 'Tokenomics razoáveis (founders ≤ 50%)' },
  { id: 'team', label: 'Equipe identificável e qualificada' },
  { id: 'university', label: 'Vinculação universitária verificada' },
];

// ─── Decision option ──────────────────────────────────────────────────────────
function DecisionOption({
  id, selected, onClick,
}: { id: Exclude<Decision, null>; selected: boolean; onClick: () => void }) {
  const cfg = DECISION_CONFIG[id];
  const Icon = cfg.icon;
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 12, width: '100%',
        padding: '12px 14px', borderRadius: 12, border: selected ? `1.5px solid ${cfg.border}` : '1.5px solid var(--rule)',
        background: selected ? cfg.bg : 'rgba(255,255,255,0.40)',
        cursor: 'pointer', textAlign: 'left', transition: 'all 150ms ease',
      }}
    >
      <Icon size={16} style={{ color: cfg.color, marginTop: 1, flexShrink: 0 }} />
      <div>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: selected ? cfg.color : 'var(--ink-primary)', marginBottom: 2 }}>
          {cfg.label}
        </p>
        <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 11, color: 'var(--ink-secondary)', lineHeight: 1.4 }}>
          {cfg.sub}
        </p>
      </div>
    </button>
  );
}

// ─── Tokenomics bar ───────────────────────────────────────────────────────────
function TokenomicsBar({ tokenomics }: { tokenomics: { founders: number; community: number; liquidity: number; reserve: number } }) {
  const segments = [
    { label: 'Founders',   pct: tokenomics.founders,  color: '#6366f1' },
    { label: 'Community',  pct: tokenomics.community, color: '#22c55e' },
    { label: 'Liquidez',   pct: tokenomics.liquidity, color: '#3b82f6' },
    { label: 'Reserva',    pct: tokenomics.reserve,   color: '#f59e0b' },
  ];
  const warn = tokenomics.founders > 50;
  return (
    <div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 8, flexWrap: 'wrap' }}>
        {segments.map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color, display: 'inline-block', flexShrink: 0 }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--ink-muted)' }}>
              {s.label}: <strong style={{ color: s.label === 'Founders' && warn ? 'var(--red)' : 'var(--ink-primary)' }}>{s.pct}%</strong>
            </span>
          </div>
        ))}
      </div>
      <div style={{ height: 6, borderRadius: 3, overflow: 'hidden', display: 'flex', gap: 2 }}>
        {segments.map(s => s.pct > 0 ? (
          <div key={s.label} style={{ flex: s.pct, background: s.color, borderRadius: 3, minWidth: 2 }} />
        ) : null)}
      </div>
      {warn && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
          <AlertTriangle size={11} style={{ color: '#b45309', flexShrink: 0 }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#b45309' }}>
            Founders com {tokenomics.founders}% — acima de 50% pode desincentivar investidores.
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function CuratorReview() {
  const { ticker } = useParams<{ ticker: string }>();
  const navigate   = useNavigate();
  const { user, hasRole }       = useAuthStore();
  const { projects, approveProject, rejectProject } = useProjectStore();
  const push = useNotificationStore(s => s.push);

  const [decision, setDecision]  = useState<Decision>(null);
  const [note, setNote]          = useState('');
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  if (!hasRole('curator')) return <AppLayout><div style={{ textAlign: 'center', padding: 96 }}><p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--ink-muted)' }}>Acesso restrito a curadores.</p></div></AppLayout>;

  const project = projects.find(p => p.ticker === `PROJ:${ticker}`);

  if (!project) {
    return (
      <AppLayout>
        <div style={{ textAlign: 'center', padding: 96 }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--ink-muted)' }}>Projeto não encontrado.</p>
          <button onClick={() => navigate('/curadoria')} style={{ marginTop: 20, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--red)', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.10em' }}>
            ← Voltar à fila
          </button>
        </div>
      </AppLayout>
    );
  }

  const gradient = getProjectGradient(project.ticker);
  const isPending = project.status === 'pending';

  const allChecked = CHECKLIST_ITEMS.every(item => checklist[item.id]);
  const canSubmit = !!decision && note.trim().length >= 30 && (decision !== 'approve' || allChecked);

  const cfg = decision ? DECISION_CONFIG[decision] : null;

  const handleDecision = async () => {
    if (!user || !decision || !canSubmit) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 700));

    if (decision === 'approve') {
      approveProject(project.ticker, user.id, user.name, note);
      push({ type: 'approved', title: 'Projeto aprovado', message: `${project.name} agora está no mercado.` });
      toast('success', `${project.name} aprovado e publicado no mercado!`, 'Aprovado');
    } else {
      rejectProject(project.ticker, user.id, user.name, note);
      push({ type: 'rejected', title: decision === 'reject' ? 'Projeto rejeitado' : 'Ajustes solicitados', message: `${project.name} foi ${decision === 'reject' ? 'rejeitado' : 'devolvido para revisão'}.` });
      toast('info', decision === 'reject' ? `${project.name} rejeitado.` : `Ajustes solicitados para ${project.name}.`, decision === 'reject' ? 'Rejeitado' : 'Revisão solicitada');
    }

    setSubmitting(false);
    navigate('/curadoria');
  };

  return (
    <AppLayout>
      {/* ── Hero ── */}
      <section className="page-s1" style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <Link
            to="/curadoria"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', textDecoration: 'none', transition: 'color 150ms' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-primary)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-muted)'; }}
          >
            <ArrowLeft size={12} />
            Voltar à fila
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            {isPending && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', display: 'inline-block', animation: 'pulse-live 2s ease-in-out infinite' }} />}
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-secondary)' }}>
              {isPending ? `Aguardando decisão · ${formatDate(project.submittedAt)}` : getFormattedDateTime()}
            </span>
          </div>
        </div>
        <h1 style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, textTransform: 'uppercase', lineHeight: 0.95, letterSpacing: '-0.025em' }}>
          <span style={{ display: 'block', fontSize: 'clamp(28px, 3.5vw, 52px)', color: 'var(--ink-primary)' }}>{project.name}</span>
          <span style={{ display: 'block', fontSize: 'clamp(18px, 2.2vw, 30px)', color: 'var(--ink-muted)', marginTop: 6 }}>{project.ticker}</span>
        </h1>
      </section>

      {/* ── Main layout: 8/4 ── */}
      <section className="page-s2" style={{ marginBottom: 60 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>

          {/* ── Left: Project content ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Identity card */}
            <div style={{ ...GLASS, overflow: 'hidden' }}>
              <div style={{ background: gradient, height: 80, padding: '18px 24px', display: 'flex', alignItems: 'flex-end' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ padding: '3px 10px', borderRadius: 5, background: 'rgba(0,0,0,0.25)', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)' }}>
                    {project.area}
                  </span>
                  <span style={{ padding: '3px 10px', borderRadius: 5, background: 'rgba(0,0,0,0.25)', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
                    {project.university}
                  </span>
                </div>
              </div>
              <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                {[
                  { label: 'Preço inicial', value: formatCurrency(project.initialPrice) },
                  { label: 'Supply total', value: `${(project.totalSupply / 1000).toFixed(0)}K tok` },
                  { label: 'Valuation', value: `R$ ${((project.initialPrice * project.totalSupply) / 1000).toFixed(0)}K` },
                  { label: 'Submetido em', value: formatDate(project.submittedAt) },
                  { label: 'Criador', value: project.founderName },
                  { label: 'Status', value: isPending ? 'Aguardando' : project.status },
                ].map(s => (
                  <div key={s.label}>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 3 }}>{s.label}</p>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, color: 'var(--ink-primary)', fontVariantNumeric: 'tabular-nums' }}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div style={{ ...GLASS, padding: '24px 28px' }}>
              <h3 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 12 }}>
                Descrição curta
              </h3>
              <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 14, color: 'var(--ink-primary)', lineHeight: 1.65, marginBottom: 24 }}>
                {project.description}
              </p>

              {project.descriptionLong && (
                <>
                  <h3 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 12 }}>
                    Descrição completa
                  </h3>
                  <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 13, color: 'var(--ink-secondary)', lineHeight: 1.75, whiteSpace: 'pre-line' }}>
                    {project.descriptionLong}
                  </p>
                </>
              )}
            </div>

            {/* Tokenomics */}
            <div style={{ ...GLASS, padding: '24px 28px' }}>
              <h3 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 16 }}>
                Tokenomics
              </h3>
              <TokenomicsBar tokenomics={project.tokenomics} />

              <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                {[
                  { label: 'Founders', value: project.tokenomics.founders, tokens: Math.floor(project.totalSupply * project.tokenomics.founders / 100) },
                  { label: 'Community', value: project.tokenomics.community, tokens: Math.floor(project.totalSupply * project.tokenomics.community / 100) },
                  { label: 'Liquidez', value: project.tokenomics.liquidity, tokens: Math.floor(project.totalSupply * project.tokenomics.liquidity / 100) },
                  { label: 'Reserva', value: project.tokenomics.reserve, tokens: Math.floor(project.totalSupply * project.tokenomics.reserve / 100) },
                ].map(s => (
                  <div key={s.label} style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.40)', border: '1px solid var(--rule)' }}>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 3 }}>{s.label}</p>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 700, color: 'var(--ink-primary)' }}>{s.value}%</p>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--ink-muted)', fontVariantNumeric: 'tabular-nums' }}>{s.tokens.toLocaleString('pt-BR')} tok</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Team */}
            {project.team.length > 0 && (
              <div style={{ ...GLASS, padding: '24px 28px' }}>
                <h3 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 16 }}>
                  Equipe ({project.team.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {project.team.map((m, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.40)', border: '1px solid var(--rule)' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>{m.name[0]}</span>
                      </div>
                      <div>
                        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, color: 'var(--ink-primary)' }}>{m.name}</p>
                        <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 11, color: 'var(--ink-muted)', marginTop: 1 }}>{m.role}</p>
                      </div>
                      {m.link && (
                        <a href={m.link} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--red)', textDecoration: 'none', letterSpacing: '0.08em' }}>
                          Lattes →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Previous reviews */}
            {project.curationHistory.length > 0 && (
              <div style={{ ...GLASS, padding: '24px 28px' }}>
                <h3 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 16 }}>
                  Histórico de curadoria ({project.curationHistory.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {project.curationHistory.map((entry) => {
                    const isApproved = entry.action === 'approved';
                    const entryColor = isApproved ? '#16a34a' : '#dc2626';
                    const entryBg    = isApproved ? 'rgba(34,197,94,0.08)' : 'rgba(229,37,26,0.07)';
                    return (
                      <div key={entry.id} style={{ padding: '14px 16px', borderRadius: 12, background: entryBg, border: `1px solid ${isApproved ? 'rgba(34,197,94,0.20)' : 'rgba(229,37,26,0.18)'}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.10em', color: entryColor }}>
                            {isApproved ? 'Aprovado' : 'Rejeitado'}
                          </span>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--ink-muted)' }}>· {entry.curatorName} · {formatDate(entry.createdAt)}</span>
                        </div>
                        {entry.reason && (
                          <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 12, color: 'var(--ink-secondary)', lineHeight: 1.6 }}>{entry.reason}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Decision panel ── */}
          <aside style={{ position: 'sticky', top: 108 }}>
            <div style={{ ...GLASS, overflow: 'hidden' }}>
              <div style={{ padding: '22px 22px 0' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: 16 }}>
                  Decisão
                </span>
              </div>

              <div style={{ padding: '0 22px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Decision options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(['approve', 'changes_requested', 'reject'] as const).map(id => (
                    <DecisionOption key={id} id={id} selected={decision === id} onClick={() => setDecision(id)} />
                  ))}
                </div>

                {/* Note textarea */}
                {decision && (
                  <div>
                    <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: 8 }}>
                      Nota para o criador <span style={{ color: 'var(--red)' }}>*</span>
                    </label>
                    <textarea
                      value={note}
                      onChange={e => setNote(e.target.value)}
                      rows={5}
                      placeholder={cfg?.placeholder}
                      style={{
                        width: '100%', borderRadius: 12, border: '1.5px solid var(--rule)',
                        padding: '12px 14px', fontFamily: "'Geist', sans-serif", fontSize: 13,
                        color: 'var(--ink-primary)', background: 'rgba(255,255,255,0.55)',
                        outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                        transition: 'border-color 150ms ease',
                      }}
                      onFocus={e => { (e.target as HTMLTextAreaElement).style.borderColor = 'var(--ink-primary)'; }}
                      onBlur={e => { (e.target as HTMLTextAreaElement).style.borderColor = 'var(--rule)'; }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--ink-muted)' }}>
                        {note.length} chars (mín. 30)
                      </span>
                      {note.trim().length >= 30 && <Check size={12} style={{ color: '#16a34a' }} />}
                    </div>
                  </div>
                )}

                {/* Checklist for approve */}
                {decision === 'approve' && (
                  <div>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 10 }}>
                      Checklist de aprovação
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {CHECKLIST_ITEMS.map(item => (
                        <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                          <div
                            onClick={() => setChecklist(c => ({ ...c, [item.id]: !c[item.id] }))}
                            style={{
                              width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                              border: checklist[item.id] ? '2px solid #16a34a' : '2px solid var(--rule)',
                              background: checklist[item.id] ? '#16a34a' : 'rgba(255,255,255,0.60)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              transition: 'all 150ms ease',
                            }}
                          >
                            {checklist[item.id] && <Check size={10} style={{ color: '#fff' }} />}
                          </div>
                          <span style={{ fontFamily: "'Geist', sans-serif", fontSize: 12, color: 'var(--ink-secondary)' }}>{item.label}</span>
                        </label>
                      ))}
                    </div>
                    {!allChecked && (
                      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#b45309', marginTop: 8 }}>
                        Marque todos os itens para aprovar.
                      </p>
                    )}
                  </div>
                )}

                {/* Submit button */}
                <button
                  onClick={handleDecision}
                  disabled={!canSubmit || submitting || !isPending}
                  style={{
                    width: '100%', height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    borderRadius: 12, border: 'none', cursor: canSubmit && isPending ? 'pointer' : 'not-allowed',
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600,
                    letterSpacing: '0.10em', textTransform: 'uppercase',
                    background: canSubmit && isPending ? (cfg?.btnBg ?? 'rgba(20,20,20,0.20)') : 'rgba(20,20,20,0.15)',
                    color: canSubmit && isPending ? '#fff' : 'var(--ink-muted)',
                    boxShadow: canSubmit && isPending ? '0 4px 16px rgba(0,0,0,0.20)' : 'none',
                    transition: 'all 150ms ease',
                    marginTop: 4,
                  }}
                >
                  {submitting ? (
                    <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.40)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite' }} />
                  ) : (
                    cfg?.btnLabel ?? 'Selecione uma decisão'
                  )}
                </button>

                {!isPending && (
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--ink-muted)', textAlign: 'center' }}>
                    Este projeto já foi revisado.
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </AppLayout>
  );
}
