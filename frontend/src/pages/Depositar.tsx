import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useWalletStore } from '../stores/wallet.store';
import { transactionsService } from '../services/transactions';
import { formatCurrency } from '../utils/format';
import { QUICK_DEPOSIT_VALUES } from '../constants';

type Step = 'amount' | 'confirm' | 'success';

export default function Depositar() {
  const navigate = useNavigate();
  const { optimisticDeposit } = useWalletStore();
  const [step, setStep] = useState<Step>('amount');
  const [rawValue, setRawValue] = useState('');
  const [loading, setLoading] = useState(false);

  const value = parseFloat(rawValue.replace(',', '.')) || 0;

  const handleQuick = (v: number) => setRawValue(v.toString());

  const handleNext = () => {
    if (value > 0) setStep('confirm');
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await transactionsService.deposit({ value });
      optimisticDeposit(value);
      setStep('success');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (raw: string) => {
    if (/^[\d,\.]*$/.test(raw)) setRawValue(raw);
  };

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto">
        <div className="mb-6">
          {step !== 'success' && (
            <button
              onClick={() => step === 'confirm' ? setStep('amount') : navigate(-1)}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-ink mb-4 transition-colors"
            >
              <ArrowLeft size={16} />
              Voltar
            </button>
          )}
          <h1 className="font-display font-bold text-3xl text-ink">Depositar</h1>
        </div>

        {step === 'amount' && (
          <Card className="p-6">
            <p className="text-sm text-gray-400 mb-6">
              Adicione saldo à sua carteira para investir em projetos universitários.
            </p>

            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Valor do depósito
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-gray-400 font-medium select-none">R$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={rawValue}
                  onChange={e => handleInputChange(e.target.value)}
                  placeholder="0,00"
                  className="w-full pl-10 pr-4 py-4 border border-card-border rounded-input bg-white font-mono text-2xl text-ink placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-150"
                />
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs text-gray-400 mb-3 font-medium">Valores rápidos</p>
              <div className="grid grid-cols-4 gap-2">
                {QUICK_DEPOSIT_VALUES.map(v => (
                  <button
                    key={v}
                    onClick={() => handleQuick(v)}
                    className={[
                      'py-2 rounded-input text-sm font-medium border transition-all duration-150',
                      value === v
                        ? 'bg-violet-600 text-white border-violet-600'
                        : 'bg-card text-gray-600 border-card-border hover:bg-card-hover',
                    ].join(' ')}
                  >
                    {formatCurrency(v)}
                  </button>
                ))}
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              disabled={value <= 0}
              onClick={handleNext}
            >
              Continuar
            </Button>
          </Card>
        )}

        {step === 'confirm' && (
          <Card className="p-6">
            <div className="space-y-4 mb-8">
              <div className="bg-surface rounded-card p-6 text-center">
                <p className="text-sm text-gray-400 mb-2">Valor do depósito</p>
                <p className="font-mono font-bold text-4xl text-violet-600">
                  {formatCurrency(value)}
                </p>
              </div>

              <div className="space-y-3 text-sm">
                {[
                  { label: 'Método', value: 'Saldo interno (simulado)' },
                  { label: 'Processamento', value: 'Imediato' },
                  { label: 'Taxa', value: 'Grátis' },
                ].map(item => (
                  <div key={item.label} className="flex justify-between">
                    <span className="text-gray-400">{item.label}</span>
                    <span className="font-medium text-ink">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setStep('amount')}
                disabled={loading}
              >
                Voltar
              </Button>
              <Button
                className="flex-1"
                loading={loading}
                onClick={handleConfirm}
              >
                Confirmar depósito
              </Button>
            </div>
          </Card>
        )}

        {step === 'success' && (
          <Card className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} className="text-success" />
            </div>
            <h2 className="font-display font-bold text-2xl text-ink mb-2">Depósito realizado!</h2>
            <p className="text-gray-400 text-sm mb-2">
              <span className="font-mono font-semibold text-ink">{formatCurrency(value)}</span>{' '}
              foram adicionados à sua carteira.
            </p>
            <p className="text-gray-400 text-sm mb-8">
              Agora você pode investir em projetos universitários.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="secondary" onClick={() => { setStep('amount'); setRawValue(''); }}>
                Novo depósito
              </Button>
              <Button onClick={() => navigate('/explorar')}>
                Explorar projetos
              </Button>
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
