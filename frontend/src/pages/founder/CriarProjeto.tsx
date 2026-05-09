import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { useProjectStore } from '../../stores/project.store';
import { useAuthStore } from '../../stores/auth.store';
import { useNotificationStore } from '../../stores/notification.store';
import { toast } from '../../components/ui/Toast';
import { formatCurrency } from '../../utils/format';
import type { Area, TeamMember } from '../../types';

// ─── Constants ─────────────────────────────────────────────────────────────────
const AREAS: Area[] = ['Tecnologia', 'Saúde', 'Engenharia', 'Sustentabilidade', 'Humanas', 'Ciências'];
const UNIVERSITIES = [
  'USP', 'UNICAMP', 'UNESP', 'UFRJ', 'UFMG', 'UNIFESP', 'UFSC', 'UFSCAR',
  'ITA', 'IME', 'ESALQ/USP', 'USP São Carlos', 'UFPE', 'UFRGS', 'UnB', 'Outra',
];

// ─── Form state ────────────────────────────────────────────────────────────────
interface WizardForm {
  name: string;
  ticker: string;
  university: string;
  area: Area;
  description: string;
  descriptionLong: string;
  totalSupply: string;
  initialPrice: string;
  founders: string;
  community: string;
  liquidity: string;
  reserve: string;
  team: TeamMember[];
}

const INITIAL: WizardForm = {
  name: '', ticker: '', university: UNIVERSITIES[0], area: 'Tecnologia',
  description: '', descriptionLong: '',
  totalSupply: '100000', initialPrice: '5.00',
  founders: '20', community: '50', liquidity: '20', reserve: '10',
  team: [{ name: '', role: '' }],
};

// ─── Styles ────────────────────────────────────────────────────────────────────
const GLASS: React.CSSProperties = {
  background: 'rgba(255,255,255,0.32)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(20,20,20,0.08)',
  borderRadius: 20,
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.65), 0 4px 16px rgba(20,20,20,0.05)',
};

const INPUT_STYLE: React.CSSProperties = {
  width: '100%', height: 44, padding: '0 14px',
  borderRadius: 10, border: '1.5px solid var(--rule)',
  background: 'rgba(255,255,255,0.55)', outline: 'none',
  fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
  color: 'var(--ink-primary)', boxSizing: 'border-box',
  transition: 'border-color 150ms ease',
};

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 10, fontWeight: 600, letterSpacing: '0.14em',
  textTransform: 'uppercase', color: 'var(--ink-muted)',
  display: 'block', marginBottom: 8,
};

// ─── Field wrapper ─────────────────────────────────────────────────────────────
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <label style={LABEL_STYLE}>{label}</label>
      {children}
      {hint && <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 11, color: 'var(--ink-muted)', marginTop: 5 }}>{hint}</p>}
    </div>
  );
}

// ─── Ticker auto-generation ────────────────────────────────────────────────────
function suggestTicker(name: string): string {
  const words = name.trim().toUpperCase().replace(/[^A-Z0-9\s]/g, '').split(/\s+/).filter(Boolean);
  const year = new Date().getFullYear().toString().slice(2);
  if (words.length === 0) return '';
  if (words.length === 1) return (words[0].slice(0, 4) + year).slice(0, 6);
  return (words.map(w => w[0]).join('').slice(0, 4) + year).slice(0, 6);
}

// ─── Tokenomics sum ────────────────────────────────────────────────────────────
function tokenomicsSum(f: WizardForm): number {
  return [f.founders, f.community, f.liquidity, f.reserve]
    .map(v => parseInt(v) || 0)
    .reduce((a, b) => a + b, 0);
}

// ─── Step 1: Dados básicos ─────────────────────────────────────────────────────
function Step1({ form, set }: { form: WizardForm; set: (k: keyof WizardForm, v: string) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Field label="Nome do projeto" hint="Nome completo, como aparecerá no mercado.">
        <input
          style={INPUT_STYLE}
          value={form.name}
          onChange={e => {
            set('name', e.target.value);
            if (!form.ticker || form.ticker === suggestTicker(form.name)) {
              set('ticker', suggestTicker(e.target.value));
            }
          }}
          placeholder="Ex: Sistema de Monitoramento Hídrico"
          onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--ink-primary)'; }}
          onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--rule)'; }}
        />
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Field label="Código do ticker" hint="3 a 6 letras/números. Ex: HIDRO, ROBO25.">
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--ink-muted)', pointerEvents: 'none' }}>
              PROJ:
            </span>
            <input
              style={{ ...INPUT_STYLE, paddingLeft: 56 }}
              value={form.ticker}
              onChange={e => set('ticker', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
              placeholder="HIDRO"
              onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--ink-primary)'; }}
              onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--rule)'; }}
            />
          </div>
        </Field>

        <Field label="Área de conhecimento">
          <select
            value={form.area}
            onChange={e => set('area', e.target.value)}
            style={{ ...INPUT_STYLE, cursor: 'pointer' }}
          >
            {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Instituição de ensino">
        <select
          value={form.university}
          onChange={e => set('university', e.target.value)}
          style={{ ...INPUT_STYLE, cursor: 'pointer' }}
        >
          {UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
      </Field>
    </div>
  );
}

// ─── Step 2: Descrição ─────────────────────────────────────────────────────────
function Step2({ form, set }: { form: WizardForm; set: (k: keyof WizardForm, v: string) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Field label="Resumo do projeto" hint={`${form.description.length}/220 caracteres — exibido nas listagens.`}>
        <textarea
          value={form.description}
          onChange={e => set('description', e.target.value.slice(0, 220))}
          rows={3}
          placeholder="Descreva em uma frase o que o projeto resolve e qual é seu diferencial..."
          style={{ ...INPUT_STYLE, height: 'auto', padding: '12px 14px', resize: 'vertical' }}
          onFocus={e => { (e.target as HTMLTextAreaElement).style.borderColor = 'var(--ink-primary)'; }}
          onBlur={e => { (e.target as HTMLTextAreaElement).style.borderColor = 'var(--rule)'; }}
        />
      </Field>

      <Field label="Descrição completa" hint="Apresente o problema, a solução, resultados e próximos passos.">
        <textarea
          value={form.descriptionLong}
          onChange={e => set('descriptionLong', e.target.value)}
          rows={8}
          placeholder="Descreva em detalhes o problema que o projeto resolve, a solução proposta, resultados preliminares e os próximos passos..."
          style={{ ...INPUT_STYLE, height: 'auto', padding: '12px 14px', resize: 'vertical' }}
          onFocus={e => { (e.target as HTMLTextAreaElement).style.borderColor = 'var(--ink-primary)'; }}
          onBlur={e => { (e.target as HTMLTextAreaElement).style.borderColor = 'var(--rule)'; }}
        />
      </Field>
    </div>
  );
}

// ─── Step 3: Tokenomics ────────────────────────────────────────────────────────
function Step3({ form, set }: { form: WizardForm; set: (k: keyof WizardForm, v: string) => void }) {
  const supply = parseInt(form.totalSupply) || 0;
  const price  = parseFloat(form.initialPrice) || 0;
  const mktCap = supply * price;
  const sum    = tokenomicsSum(form);
  const sumOk  = sum === 100;

  const pctFields = [
    { key: 'founders'  as const, label: 'Founders',   color: '#6366f1' },
    { key: 'community' as const, label: 'Community',  color: '#22c55e' },
    { key: 'liquidity' as const, label: 'Liquidity',  color: '#3b82f6' },
    { key: 'reserve'   as const, label: 'Reserve',    color: '#f59e0b' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Field label="Supply total de tokens" hint="Quantidade máxima de tokens a serem emitidos.">
          <input
            type="number" min="1000" max="10000000"
            style={INPUT_STYLE}
            value={form.totalSupply}
            onChange={e => set('totalSupply', e.target.value)}
            onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--ink-primary)'; }}
            onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--rule)'; }}
          />
        </Field>

        <Field label="Preço inicial por token (R$)" hint="Valor de lançamento de cada token.">
          <input
            type="number" min="0.10" max="1000" step="0.10"
            style={INPUT_STYLE}
            value={form.initialPrice}
            onChange={e => set('initialPrice', e.target.value)}
            onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--ink-primary)'; }}
            onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--rule)'; }}
          />
        </Field>
      </div>

      {/* Market cap preview */}
      {mktCap > 0 && (
        <div style={{ padding: '14px 18px', borderRadius: 12, background: 'rgba(255,255,255,0.55)', border: '1px solid var(--rule)', display: 'flex', gap: 28 }}>
          <div>
            <p style={{ ...LABEL_STYLE, marginBottom: 2 }}>Valuation inicial</p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 700, color: 'var(--ink-primary)', fontVariantNumeric: 'tabular-nums' }}>
              {formatCurrency(mktCap)}
            </p>
          </div>
          <div>
            <p style={{ ...LABEL_STYLE, marginBottom: 2 }}>Captação alvo (community)</p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 700, color: '#22c55e', fontVariantNumeric: 'tabular-nums' }}>
              {formatCurrency(mktCap * (parseInt(form.community) || 0) / 100)}
            </p>
          </div>
        </div>
      )}

      {/* Tokenomics */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={LABEL_STYLE}>Distribuição de tokens</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: sumOk ? '#16a34a' : 'var(--red)' }}>
            {sum}% / 100%
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 12 }}>
          {pctFields.map(f => (
            <div key={f.key}>
              <label style={{ ...LABEL_STYLE, color: f.color, marginBottom: 6 }}>{f.label} (%)</label>
              <input
                type="number" min="0" max="100"
                style={INPUT_STYLE}
                value={form[f.key]}
                onChange={e => set(f.key, e.target.value)}
                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = f.color; }}
                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--rule)'; }}
              />
            </div>
          ))}
        </div>

        {/* Visual bar */}
        <div style={{ height: 6, borderRadius: 3, overflow: 'hidden', display: 'flex', gap: 2 }}>
          {pctFields.map(f => {
            const v = parseInt(form[f.key]) || 0;
            return v > 0 ? <div key={f.key} style={{ flex: v, background: f.color, borderRadius: 3, minWidth: 2 }} /> : null;
          })}
        </div>

        {!sumOk && sum > 0 && (
          <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 11, color: 'var(--red)', marginTop: 6 }}>
            A soma deve ser exatamente 100%. Faltam {100 - sum}%.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Step 4: Equipe ────────────────────────────────────────────────────────────
function Step4({ form, setTeam }: { form: WizardForm; setTeam: (team: TeamMember[]) => void }) {
  const addMember = () => setTeam([...form.team, { name: '', role: '' }]);
  const removeMember = (i: number) => setTeam(form.team.filter((_, idx) => idx !== i));
  const updateMember = (i: number, k: keyof TeamMember, v: string) => {
    setTeam(form.team.map((m, idx) => idx === i ? { ...m, [k]: v } : m));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 13, color: 'var(--ink-secondary)' }}>
        Adicione os membros principais da equipe do projeto.
      </p>

      {form.team.map((member, i) => (
        <div key={i} style={{ padding: '16px', borderRadius: 12, background: 'rgba(255,255,255,0.55)', border: '1px solid var(--rule)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ ...LABEL_STYLE, margin: 0 }}>Membro {i + 1}</span>
            {form.team.length > 1 && (
              <button onClick={() => removeMember(i)} style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, border: 'none', background: 'rgba(229,37,26,0.10)', color: 'var(--red)', cursor: 'pointer' }}>
                <Trash2 size={12} />
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={LABEL_STYLE}>Nome completo</label>
              <input
                style={INPUT_STYLE}
                value={member.name}
                onChange={e => updateMember(i, 'name', e.target.value)}
                placeholder="Prof. Dr. João Silva"
                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--ink-primary)'; }}
                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--rule)'; }}
              />
            </div>
            <div>
              <label style={LABEL_STYLE}>Cargo / função</label>
              <input
                style={INPUT_STYLE}
                value={member.role}
                onChange={e => updateMember(i, 'role', e.target.value)}
                placeholder="Coordenador Científico"
                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--ink-primary)'; }}
                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--rule)'; }}
              />
            </div>
          </div>

          <div>
            <label style={LABEL_STYLE}>Lattes / link (opcional)</label>
            <input
              style={INPUT_STYLE}
              value={member.link ?? ''}
              onChange={e => updateMember(i, 'link', e.target.value)}
              placeholder="https://lattes.cnpq.br/..."
              onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--ink-primary)'; }}
              onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--rule)'; }}
            />
          </div>
        </div>
      ))}

      <button
        onClick={addMember}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 44, borderRadius: 12, border: '1.5px dashed var(--rule)', background: 'transparent', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--ink-muted)', cursor: 'pointer', transition: 'border-color 150ms, color 150ms' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--ink-primary)'; e.currentTarget.style.color = 'var(--ink-primary)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--rule)'; e.currentTarget.style.color = 'var(--ink-muted)'; }}
      >
        <Plus size={14} />
        Adicionar membro
      </button>
    </div>
  );
}

// ─── Step 5: Revisão ──────────────────────────────────────────────────────────
function Step5({ form }: { form: WizardForm }) {
  const supply  = parseInt(form.totalSupply) || 0;
  const price   = parseFloat(form.initialPrice) || 0;
  const mktCap  = supply * price;

  const sections = [
    {
      title: 'Dados básicos',
      rows: [
        ['Projeto', form.name],
        ['Ticker', `PROJ:${form.ticker}`],
        ['Universidade', form.university],
        ['Área', form.area],
      ],
    },
    {
      title: 'Tokenomics',
      rows: [
        ['Supply total', `${parseInt(form.totalSupply || '0').toLocaleString('pt-BR')} tokens`],
        ['Preço inicial', formatCurrency(price)],
        ['Valuation', formatCurrency(mktCap)],
        ['Founders / Community / Liquidity / Reserve', `${form.founders}% / ${form.community}% / ${form.liquidity}% / ${form.reserve}%`],
      ],
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {sections.map(sec => (
        <div key={sec.title} style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(255,255,255,0.55)', border: '1px solid var(--rule)' }}>
          <p style={{ ...LABEL_STYLE, marginBottom: 12 }}>{sec.title}</p>
          {sec.rows.map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(20,20,20,0.04)' }}>
              <span style={{ fontFamily: "'Geist', sans-serif", fontSize: 12, color: 'var(--ink-muted)' }}>{label}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: 'var(--ink-primary)', textAlign: 'right', maxWidth: '60%' }}>{value}</span>
            </div>
          ))}
        </div>
      ))}

      <div style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(255,255,255,0.55)', border: '1px solid var(--rule)' }}>
        <p style={{ ...LABEL_STYLE, marginBottom: 12 }}>Equipe ({form.team.filter(m => m.name).length} membros)</p>
        {form.team.filter(m => m.name).map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(20,20,20,0.04)' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: 'var(--ink-primary)' }}>{m.name}</span>
            <span style={{ fontFamily: "'Geist', sans-serif", fontSize: 12, color: 'var(--ink-muted)' }}>{m.role}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.20)' }}>
        <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 13, color: '#166534', lineHeight: 1.6 }}>
          Ao submeter, o projeto entrará na fila de curadoria. Após aprovação, ficará disponível no mercado para investidores.
        </p>
      </div>
    </div>
  );
}

// ─── Main wizard ───────────────────────────────────────────────────────────────
const STEPS = [
  { label: 'Básico',    title: 'Dados do projeto',        subtitle: 'Identifique seu ativo no mercado' },
  { label: 'Descrição', title: 'Descreva o projeto',       subtitle: 'Explique o problema e a solução' },
  { label: 'Tokens',    title: 'Tokenomics',               subtitle: 'Defina supply e distribuição' },
  { label: 'Equipe',    title: 'Equipe do projeto',        subtitle: 'Quem está por trás da pesquisa' },
  { label: 'Revisar',   title: 'Revisão e submissão',     subtitle: 'Confirme os dados antes de enviar' },
];

export default function CriarProjeto() {
  const navigate = useNavigate();
  const { user, hasRole } = useAuthStore();
  const { addProject, projects } = useProjectStore();
  const push = useNotificationStore(s => s.push);

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<WizardForm>(INITIAL);
  const [submitting, setSubmitting] = useState(false);

  const setField = (k: keyof WizardForm, v: string) => setForm(f => ({ ...f, [k]: v }));
  const setTeam  = (team: TeamMember[]) => setForm(f => ({ ...f, team }));

  if (!hasRole('founder')) {
    return (
      <AppLayout>
        <div style={{ textAlign: 'center', padding: '96px 24px' }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--ink-muted)' }}>
            Ative o papel de criador em Configurações para criar projetos.
          </p>
        </div>
      </AppLayout>
    );
  }

  // ── Validation per step ────────────────────────────────────────────────────
  const canAdvance = (): boolean => {
    const ticker = `PROJ:${form.ticker}`;
    const tickerUsed = projects.some(p => p.ticker === ticker);
    switch (step) {
      case 0: return form.name.trim().length >= 4 && form.ticker.trim().length >= 2 && !tickerUsed;
      case 1: return form.description.trim().length >= 20 && form.descriptionLong.trim().length >= 40;
      case 2: {
        const supply = parseInt(form.totalSupply) || 0;
        const price  = parseFloat(form.initialPrice) || 0;
        return supply >= 1000 && price >= 0.1 && tokenomicsSum(form) === 100;
      }
      case 3: return form.team.some(m => m.name.trim() && m.role.trim());
      default: return true;
    }
  };

  const tickerUsed = projects.some(p => p.ticker === `PROJ:${form.ticker}`);

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 900));
    addProject({
      ticker: form.ticker,
      name: form.name,
      university: form.university,
      area: form.area as Area,
      description: form.description,
      descriptionLong: form.descriptionLong,
      totalSupply: parseInt(form.totalSupply) || 100000,
      initialPrice: parseFloat(form.initialPrice) || 5,
      tokenomics: {
        founders:  parseInt(form.founders)  || 20,
        community: parseInt(form.community) || 50,
        liquidity: parseInt(form.liquidity) || 20,
        reserve:   parseInt(form.reserve)   || 10,
      },
      team: form.team.filter(m => m.name.trim()),
      founderId:   user.id,
      founderName: user.name,
    });
    push({ type: 'info', title: 'Projeto submetido', message: `${form.name} está em análise pela curadoria.` });
    toast('success', 'Projeto enviado para curadoria!', 'Submetido com sucesso');
    setSubmitting(false);
    navigate('/founder');
  };

  const currentStep = STEPS[step];

  return (
    <AppLayout>
      {/* Header */}
      <section className="page-s1" style={{ marginBottom: 32 }}>
        <button
          onClick={() => navigate('/founder')}
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, transition: 'color 150ms' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-primary)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-muted)'; }}
        >
          ← Meus projetos
        </button>
        <h1 style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, textTransform: 'uppercase', lineHeight: 0.95, letterSpacing: '-0.025em', fontSize: 'clamp(32px, 4vw, 56px)', color: 'var(--ink-primary)', marginBottom: 8 }}>
          Novo Projeto
        </h1>
        <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 14, color: 'var(--ink-secondary)' }}>
          Crie seu ativo científico em 5 passos.
        </p>
      </section>

      {/* Progress bar */}
      <section className="page-s2" style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: '100%', height: 3, borderRadius: 2,
                background: i < step ? 'var(--red)' : i === step ? 'var(--ink-primary)' : 'rgba(20,20,20,0.10)',
                transition: 'background 300ms ease',
              }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: i <= step ? 600 : 400, letterSpacing: '0.12em', textTransform: 'uppercase', color: i <= step ? 'var(--ink-primary)' : 'var(--ink-muted)' }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Form card */}
      <section className="page-s3" style={{ maxWidth: 680, margin: '0 auto' }}>
        <div style={{ ...GLASS, padding: '32px 36px' }}>
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: 6 }}>
              Passo {step + 1} de {STEPS.length}
            </p>
            <h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 600, textTransform: 'uppercase', color: 'var(--ink-primary)', marginBottom: 2 }}>
              {currentStep.title}
            </h2>
            <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 13, color: 'var(--ink-secondary)' }}>
              {currentStep.subtitle}
            </p>
          </div>

          {/* Ticker collision warning */}
          {step === 0 && form.ticker && tickerUsed && (
            <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 10, background: 'rgba(229,37,26,0.08)', border: '1px solid rgba(229,37,26,0.20)' }}>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--red)' }}>
                Ticker PROJ:{form.ticker} já está em uso. Escolha outro.
              </p>
            </div>
          )}

          {/* Step content */}
          {step === 0 && <Step1 form={form} set={setField} />}
          {step === 1 && <Step2 form={form} set={setField} />}
          {step === 2 && <Step3 form={form} set={setField} />}
          {step === 3 && <Step4 form={form} setTeam={setTeam} />}
          {step === 4 && <Step5 form={form} />}

          {/* Navigation */}
          <div style={{ display: 'flex', gap: 10, marginTop: 32 }}>
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, height: 48, padding: '0 20px', borderRadius: 12, border: '1.5px solid var(--rule)', background: 'transparent', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--ink-secondary)', cursor: 'pointer' }}
              >
                <ChevronLeft size={14} />
                Voltar
              </button>
            )}

            <div style={{ flex: 1 }} />

            {step < STEPS.length - 1 ? (
              <button
                onClick={() => canAdvance() && setStep(s => s + 1)}
                disabled={!canAdvance()}
                style={{ display: 'flex', alignItems: 'center', gap: 8, height: 48, padding: '0 28px', borderRadius: 12, border: 'none', background: canAdvance() ? 'var(--ink-primary)' : 'rgba(20,20,20,0.20)', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: canAdvance() ? 'var(--bg-form)' : 'var(--ink-muted)', cursor: canAdvance() ? 'pointer' : 'not-allowed', boxShadow: canAdvance() ? '0 4px 16px rgba(10,10,10,0.15)' : 'none', transition: 'all 150ms' }}
              >
                Próximo
                <ChevronRight size={14} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{ display: 'flex', alignItems: 'center', gap: 10, height: 48, padding: '0 28px', borderRadius: 12, border: 'none', background: submitting ? 'rgba(20,20,20,0.20)' : 'var(--red)', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#fff', cursor: submitting ? 'not-allowed' : 'pointer', boxShadow: submitting ? 'none' : '0 4px 16px rgba(229,37,26,0.30)', transition: 'all 150ms' }}
              >
                {submitting ? (
                  <>
                    <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.40)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite' }} />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    Submeter para curadoria
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
