import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import {
  AuthLayout, AuthInput, AuthCheckbox, AuthSubmitButton,
  AuthDivider, SocialButtons, AuthError, AuthLink,
} from '../../components/auth/AuthLayout';
import { useAuthStore } from '../../stores/auth.store';
import { authService } from '../../services/auth';

export default function Register() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<'google' | 'github' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const clearField = (field: string) =>
    setFieldErrors((e) => { const n = { ...e }; delete n[field]; return n; });

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Nome obrigatório';
    if (!email || !/\S+@\S+\.\S+/.test(email)) errs.email = 'E-mail inválido';
    if (!password || password.length < 6) errs.password = 'Mínimo 6 caracteres';
    if (password !== confirmPassword) errs.confirm = 'Senhas não coincidem';
    if (!acceptTerms) errs.terms = 'Aceite os termos para continuar';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await authService.register(name, email, password);
      login(result.user, result.token);
      navigate('/');
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 409) {
        setError('Este e-mail já está em uso');
      } else if (status === 400) {
        setError('Dados inválidos. Verifique os campos.');
      } else if (!err?.response) {
        setError('Servidor offline. Tente novamente mais tarde.');
      } else {
        setError('Erro ao criar conta. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = async (provider: 'google' | 'github') => {
    setError(null);
    setLoadingProvider(provider);
    try {
      const result = await authService.socialLogin(provider);
      login(result.user, result.token);
      navigate('/');
    } catch {
      setError('Erro ao conectar com ' + (provider === 'google' ? 'Google' : 'GitHub'));
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <AuthLayout kicker="Comece sua jornada">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <span style={{
          display: 'block',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11, fontWeight: 500,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'var(--ink-muted)', marginBottom: 10,
        }}>
          Crie sua conta
        </span>
        <h2 style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 32, fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '-0.02em',
          lineHeight: 1.1, color: 'var(--ink-primary)',
        }}>
          Cadastrar
        </h2>
      </div>

      {error && <AuthError message={error} />}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <AuthInput
          label="Nome completo"
          type="text"
          value={name}
          onChange={(v) => { setName(v); clearField('name'); }}
          placeholder="Seu nome"
          autoComplete="name"
          icon={<User size={16} />}
          error={fieldErrors.name}
        />

        <AuthInput
          label="E-mail"
          type="email"
          value={email}
          onChange={(v) => { setEmail(v); clearField('email'); }}
          placeholder="seu@email.com"
          autoComplete="email"
          icon={<Mail size={16} />}
          error={fieldErrors.email}
        />

        <AuthInput
          label="Senha"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(v) => { setPassword(v); clearField('password'); }}
          placeholder="Mínimo 6 caracteres"
          autoComplete="new-password"
          icon={<Lock size={16} />}
          error={fieldErrors.password}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)', display: 'flex', alignItems: 'center', padding: 0, transition: 'color 150ms ease' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-primary)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-muted)'; }}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

        <AuthInput
          label="Confirmar senha"
          type={showConfirm ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(v) => { setConfirmPassword(v); clearField('confirm'); }}
          placeholder="Repita a senha"
          autoComplete="new-password"
          icon={<Lock size={16} />}
          error={fieldErrors.confirm}
          rightElement={
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)', display: 'flex', alignItems: 'center', padding: 0, transition: 'color 150ms ease' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-primary)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-muted)'; }}
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

        {/* Terms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <AuthCheckbox
            checked={acceptTerms}
            onChange={() => { setAcceptTerms((v) => !v); clearField('terms'); }}
            label={
              <span>
                Aceito os{' '}
                <a
                  href="#"
                  style={{ color: 'var(--ink-primary)', textDecoration: 'underline', textUnderlineOffset: '2px' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  Termos de Uso
                </a>
                {' '}e{' '}
                <a
                  href="#"
                  style={{ color: 'var(--ink-primary)', textDecoration: 'underline', textUnderlineOffset: '2px' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  Privacidade
                </a>
              </span>
            }
          />
          {fieldErrors.terms && (
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.08em', color: 'var(--red)', textTransform: 'uppercase', paddingLeft: 24 }}>
              {fieldErrors.terms}
            </span>
          )}
        </div>

        <AuthSubmitButton loading={loading}>Criar conta</AuthSubmitButton>
      </form>

      <AuthDivider />

      <SocialButtons
        onGoogle={() => handleSocial('google')}
        onGitHub={() => handleSocial('github')}
        loadingProvider={loadingProvider}
      />

      <p style={{
        textAlign: 'center', marginTop: 28,
        fontSize: 14, color: 'var(--ink-secondary)',
        fontFamily: "'Geist', 'Inter', sans-serif",
      }}>
        Já tem uma conta?{' '}
        <AuthLink to="/login">Entrar</AuthLink>
      </p>
    </AuthLayout>
  );
}
