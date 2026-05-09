import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Briefcase, LogOut, Check, Lock } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { toast } from '../components/ui/Toast';
import { useAuthStore } from '../stores/auth.store';
import { getFormattedDateTime } from '../utils/briefing';

// ─── Styles ───────────────────────────────────────────────────────────────────
const GLASS: React.CSSProperties = {
  background: 'rgba(255,255,255,0.32)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(20,20,20,0.08)',
  borderRadius: 20,
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.65), 0 4px 16px rgba(20,20,20,0.05)',
};

type Tab = 'conta' | 'seguranca' | 'papeis';
const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'conta',     label: 'Conta',      icon: <User size={14} />     },
  { id: 'seguranca', label: 'Segurança',   icon: <Shield size={14} />   },
  { id: 'papeis',    label: 'Papéis',      icon: <Briefcase size={14} /> },
];

function FieldInput({ label, value, onChange, type = 'text', disabled = false, hint }: {
  label: string; value: string; onChange?: (v: string) => void;
  type?: string; disabled?: boolean; hint?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: 6 }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', boxSizing: 'border-box', height: 44, padding: '0 14px',
          borderRadius: 10, border: `1.5px solid ${focused ? 'var(--ink-primary)' : disabled ? 'rgba(20,20,20,0.06)' : 'var(--rule)'}`,
          background: disabled ? 'rgba(20,20,20,0.04)' : 'rgba(255,255,255,0.60)',
          fontFamily: "'Geist', sans-serif", fontSize: 13, color: disabled ? 'var(--ink-muted)' : 'var(--ink-primary)',
          outline: 'none', transition: 'border-color 150ms ease',
        }}
      />
      {hint && <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 11, color: 'var(--ink-muted)', marginTop: 4 }}>{hint}</p>}
    </div>
  );
}

function RoleCard({ title, description, active, activeLabel = 'Ativo', inactiveLabel, onActivate, locked = false }: {
  title: string; description: string; active: boolean;
  activeLabel?: string; inactiveLabel?: string; onActivate?: () => void; locked?: boolean;
}) {
  return (
    <div style={{
      ...GLASS,
      padding: '20px 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      border: active ? '1px solid rgba(34,197,94,0.25)' : '1px solid rgba(20,20,20,0.08)',
      background: active ? 'rgba(34,197,94,0.05)' : 'rgba(255,255,255,0.32)',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, color: 'var(--ink-primary)' }}>
            {title}
          </span>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 600,
            letterSpacing: '0.10em', textTransform: 'uppercase', padding: '2px 8px', borderRadius: 5,
            background: active ? 'rgba(34,197,94,0.12)' : 'rgba(20,20,20,0.07)',
            border: active ? '1px solid rgba(34,197,94,0.25)' : '1px solid rgba(20,20,20,0.10)',
            color: active ? '#16a34a' : 'var(--ink-muted)',
          }}>
            {active ? activeLabel : (inactiveLabel ?? 'Inativo')}
          </span>
        </div>
        <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 12, color: 'var(--ink-secondary)' }}>
          {description}
        </p>
      </div>

      {active ? (
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Check size={16} style={{ color: '#16a34a' }} />
        </div>
      ) : locked ? (
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(20,20,20,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Lock size={14} style={{ color: 'var(--ink-muted)' }} />
        </div>
      ) : onActivate ? (
        <button
          onClick={onActivate}
          style={{ height: 36, padding: '0 18px', borderRadius: 10, border: 'none', background: 'var(--ink-primary)', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--bg-form)', cursor: 'pointer', flexShrink: 0, transition: 'transform 120ms ease' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          Ativar
        </button>
      ) : null}
    </div>
  );
}

export default function Configuracoes() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('conta');
  const { user, logout, hasRole, activateFounderRole, updateUser } = useAuthStore();

  const [name, setName]   = useState(user?.name  || '');
  const [bio,  setBio]    = useState(user?.bio    || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    updateUser({ name, bio });
    toast('success', 'Perfil atualizado!');
    setSaving(false);
  };

  const handleActivateFounder = () => {
    activateFounderRole();
    toast('success', 'Papel de Creator ativado! Agora você pode submeter projetos.');
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const isFounder = hasRole('founder');
  const isCurator = hasRole('curator');

  return (
    <AppLayout>
      {/* Hero */}
      <section className="page-s1" style={{ marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid var(--rule)' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: 16 }}>
          {getFormattedDateTime()}
        </span>
        <h1 style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, textTransform: 'uppercase', lineHeight: 0.95, letterSpacing: '-0.025em' }}>
          <span style={{ display: 'block', fontSize: 'clamp(36px, 4.5vw, 64px)', color: 'var(--ink-primary)' }}>Configurações</span>
        </h1>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 32, alignItems: 'start' }}>
        {/* Sidebar nav */}
        <aside>
          <div style={{ ...GLASS, padding: 8, position: 'sticky', top: 112 }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {TABS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    height: 40, padding: '0 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600,
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    background: activeTab === t.id ? 'rgba(20,20,20,0.07)' : 'transparent',
                    color: activeTab === t.id ? 'var(--ink-primary)' : 'var(--ink-muted)',
                    transition: 'all 150ms ease',
                  }}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}

              <div style={{ height: 1, background: 'var(--rule)', margin: '6px 4px' }} />

              <button
                onClick={handleLogout}
                style={{ display: 'flex', alignItems: 'center', gap: 10, height: 40, padding: '0 12px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', background: 'transparent', color: 'var(--red)', transition: 'background 150ms ease' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(229,37,26,0.07)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <LogOut size={14} />
                Sair
              </button>
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main>
          {/* Conta */}
          {activeTab === 'conta' && (
            <div style={{ ...GLASS, padding: '28px 32px' }}>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 20 }}>
                Informações da conta
              </p>

              {/* Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #1a1a1a 0%, #3a3a3a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 700, color: '#fff' }}>
                    {(user?.name?.[0] ?? 'U').toUpperCase()}
                  </span>
                </div>
                <div>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, color: 'var(--ink-primary)' }}>{user?.name}</p>
                  <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 12, color: 'var(--ink-muted)' }}>{user?.email}</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 440 }}>
                <FieldInput label="Nome completo" value={name} onChange={setName} />
                <FieldInput label="Email" value={user?.email ?? ''} type="email" disabled hint="O email não pode ser alterado" />
                <div>
                  <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: 6 }}>
                    Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    rows={3}
                    placeholder="Conte um pouco sobre você..."
                    style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 10, border: '1.5px solid var(--rule)', background: 'rgba(255,255,255,0.60)', fontFamily: "'Geist', sans-serif", fontSize: 13, color: 'var(--ink-primary)', outline: 'none', resize: 'vertical' }}
                    onFocus={e => { (e.target as HTMLTextAreaElement).style.borderColor = 'var(--ink-primary)'; }}
                    onBlur={e => { (e.target as HTMLTextAreaElement).style.borderColor = 'var(--rule)'; }}
                  />
                </div>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{ height: 44, padding: '0 24px', borderRadius: 10, border: 'none', background: saving ? 'rgba(20,20,20,0.15)' : 'var(--ink-primary)', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: saving ? 'var(--ink-muted)' : 'var(--bg-form)', cursor: saving ? 'not-allowed' : 'pointer', alignSelf: 'flex-start', transition: 'all 150ms' }}
                >
                  {saving ? 'Salvando...' : 'Salvar alterações'}
                </button>
              </div>
            </div>
          )}

          {/* Segurança */}
          {activeTab === 'seguranca' && (
            <div style={{ ...GLASS, padding: '28px 32px' }}>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 20 }}>
                Segurança da conta
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 440 }}>
                <FieldInput label="Senha atual" value="" type="password" />
                <FieldInput label="Nova senha" value="" type="password" />
                <FieldInput label="Confirmar nova senha" value="" type="password" />
                <button style={{ height: 44, padding: '0 24px', borderRadius: 10, border: 'none', background: 'var(--ink-primary)', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--bg-form)', cursor: 'pointer', alignSelf: 'flex-start' }}>
                  Alterar senha
                </button>
              </div>

              <div style={{ height: 1, background: 'var(--rule)', margin: '28px 0' }} />

              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: 'var(--ink-primary)', marginBottom: 4 }}>
                Autenticação em dois fatores
              </p>
              <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 13, color: 'var(--ink-secondary)', marginBottom: 14 }}>
                Adicione uma camada extra de segurança à sua conta.
              </p>
              <button style={{ height: 44, padding: '0 24px', borderRadius: 10, border: '1.5px solid var(--rule)', background: 'rgba(255,255,255,0.55)', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--ink-primary)', cursor: 'pointer' }}>
                Configurar 2FA
              </button>
            </div>
          )}

          {/* Papéis */}
          {activeTab === 'papeis' && (
            <div>
              <div style={{ ...GLASS, padding: '28px 32px', marginBottom: 16 }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 6 }}>
                  Papéis e permissões
                </p>
                <p style={{ fontFamily: "'Geist', sans-serif", fontSize: 13, color: 'var(--ink-secondary)' }}>
                  Cada papel dá acesso a funcionalidades específicas da plataforma.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <RoleCard
                  title="Investidor"
                  description="Explore e invista em projetos de pesquisa tokenizados."
                  active
                  activeLabel="Ativo"
                />

                <RoleCard
                  title="Creator"
                  description="Submeta e gerencie seus próprios projetos de pesquisa para o mercado."
                  active={isFounder}
                  activeLabel="Ativo"
                  inactiveLabel="Inativo"
                  onActivate={!isFounder ? handleActivateFounder : undefined}
                />

                <RoleCard
                  title="Curador"
                  description="Revise e aprove submissões de projetos. Acesso mediante convite da equipe DeSCin."
                  active={isCurator}
                  activeLabel="Ativo"
                  inactiveLabel="Por convite"
                  locked={!isCurator}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </AppLayout>
  );
}
