import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, TrendingUp, Lightbulb, ShieldCheck, KeyRound } from 'lucide-react';
import {
  AuthLayout, AuthInput, AuthSubmitButton, AuthError, AuthLink,
} from '../../components/auth/AuthLayout';
import { useAuthStore } from '../../stores/auth.store';
import { authService } from '../../services/auth';

// ─── Role picker ──────────────────────────────────────────────────────────────
type RoleChoice = 'investor' | 'founder' | 'curator';

const ROLES: {
  id: RoleChoice;
  label: string;
  sub: string;
  icon: React.ReactNode;
  email: string;
  password: string;
}[] = [
  {
    id: 'investor',
    label: 'Investidor',
    sub: 'Explore e invista',
    icon: <TrendingUp size={18} />,
    email: 'investor@descin.com',
    password: '123456',
  },
  {
    id: 'founder',
    label: 'Creator',
    sub: 'Submeta projetos',
    icon: <Lightbulb size={18} />,
    email: 'founder@descin.com',
    password: '123456',
  },
  {
    id: 'curator',
    label: 'Curador',
    sub: 'Aprove projetos',
    icon: <ShieldCheck size={18} />,
    email: 'curator@descin.com',
    password: '123456',
  },
];

function RoleCard({
  role, selected, onClick,
}: { role: typeof ROLES[0]; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 8, padding: '14px 10px', borderRadius: 14, cursor: 'pointer',
        border: selected
          ? '1.5px solid var(--ink-primary)'
          : '1.5px solid rgba(20,20,20,0.10)',
        background: selected
          ? 'rgba(20,20,20,0.06)'
          : 'rgba(255,255,255,0.45)',
        color: selected ? 'var(--ink-primary)' : 'var(--ink-muted)',
        transition: 'all 160ms ease',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      onMouseEnter={e => {
        if (!selected) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.70)';
      }}
      onMouseLeave={e => {
        if (!selected) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.45)';
      }}
    >
      <span style={{ color: selected ? 'var(--ink-primary)' : 'var(--ink-muted)', transition: 'color 160ms' }}>
        {role.icon}
      </span>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {role.label}
      </span>
      <span style={{ fontFamily: "'Geist', sans-serif", fontSize: 10, color: 'var(--ink-muted)', lineHeight: 1.3, textAlign: 'center' }}>
        {role.sub}
      </span>
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Login() {
  const navigate = useNavigate();
  const { login, activateFounderRole, activateCuratorRole } = useAuthStore();

  const [selectedRole, setSelectedRole] = useState<RoleChoice>('investor');
  const [email, setEmail] = useState('investor@descin.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [curatorCode, setCuratorCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleSelect = (role: typeof ROLES[0]) => {
    setSelectedRole(role.id);
    setEmail(role.email);
    setPassword(role.password);
    setCuratorCode('');
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (selectedRole === 'curator' && curatorCode !== '00000') {
      setError('Código de curador inválido. Solicite o código à equipe DeSCin.');
      return;
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) { setError('E-mail inválido'); return; }
    if (!password || password.length < 6)        { setError('Senha deve ter mínimo 6 caracteres'); return; }

    setLoading(true);
    try {
      const result = await authService.login(email, password);
      if (!result) {
        setError('E-mail ou senha incorretos.');
        return;
      }
      login(result.user, result.token);

      if (selectedRole === 'founder')  activateFounderRole();
      if (selectedRole === 'curator')  activateCuratorRole();

      navigate('/');
    } catch {
      setError('Erro ao conectar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <span style={{ display: 'block', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 10 }}>
          Bem-vindo de volta
        </span>
        <h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 32, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1.1, color: 'var(--ink-primary)' }}>
          Entrar
        </h2>
      </div>

      {/* Role picker */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 10 }}>
          Entrar como
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          {ROLES.map(role => (
            <RoleCard
              key={role.id}
              role={role}
              selected={selectedRole === role.id}
              onClick={() => handleRoleSelect(role)}
            />
          ))}
        </div>
      </div>

      {error && <AuthError message={error} />}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <AuthInput
          label="E-mail"
          type="email"
          value={email}
          onChange={(v) => setEmail(v)}
          placeholder="seu@email.com"
          autoComplete="email"
          icon={<Mail size={16} />}
        />

        <AuthInput
          label="Senha"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(v) => setPassword(v)}
          placeholder="••••••••"
          autoComplete="current-password"
          icon={<Lock size={16} />}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)', display: 'flex', alignItems: 'center', padding: 0, transition: 'color 150ms ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-primary)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-muted)'; }}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

        {/* Curator code — only when curador selected */}
        {selectedRole === 'curator' && (
          <AuthInput
            label="Código de acesso (curador)"
            type={showCode ? 'text' : 'password'}
            value={curatorCode}
            onChange={v => setCuratorCode(v)}
            placeholder="•••••"
            autoComplete="off"
            icon={<KeyRound size={16} />}
            rightElement={
              <button
                type="button"
                onClick={() => setShowCode(v => !v)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)', display: 'flex', alignItems: 'center', padding: 0 }}
                tabIndex={-1}
              >
                {showCode ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -4 }}>
          <Link
            to="/recuperar-senha"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--ink-muted)', textDecoration: 'none', transition: 'color 150ms ease' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--red)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-muted)'; }}
          >
            Esqueceu a senha?
          </Link>
        </div>

        <AuthSubmitButton loading={loading}>
          Entrar como {ROLES.find(r => r.id === selectedRole)?.label}
        </AuthSubmitButton>
      </form>

      <p style={{ textAlign: 'center', marginTop: 28, fontSize: 14, color: 'var(--ink-secondary)', fontFamily: "'Geist', 'Inter', sans-serif" }}>
        Ainda não tem conta?{' '}
        <AuthLink to="/cadastrar">Criar conta</AuthLink>
      </p>
    </AuthLayout>
  );
}
