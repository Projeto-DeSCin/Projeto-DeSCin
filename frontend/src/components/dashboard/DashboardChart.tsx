import { useState } from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { PeriodSelector } from './PeriodSelector';
import { MOCK_PORTFOLIO_HISTORY } from '../../mocks/data';
import { filterPortfolioHistory } from '../../utils/period';
import type { Period } from '../../types';

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  const val = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payload[0].value);
  const d = label ? new Date(label).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : '';
  return (
    <div style={{
      background: 'rgba(255,255,255,0.90)', backdropFilter: 'blur(16px)',
      border: '1px solid rgba(20,20,20,0.10)', borderRadius: 10,
      padding: '8px 12px', boxShadow: '0 8px 24px rgba(20,20,20,0.10)',
    }}>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#7A7A82', marginBottom: 3 }}>{d}</p>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, fontWeight: 600, color: '#0A0A0A', fontVariantNumeric: 'tabular-nums' }}>{val}</p>
    </div>
  );
}

export function DashboardChart() {
  const [period, setPeriod] = useState('1M');
  const filtered = filterPortfolioHistory(MOCK_PORTFOLIO_HISTORY, period as Period);
  const data = filtered.map(p => ({ date: p.timestamp, value: p.value }));

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: 4 }}>
            Performance
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--ink-primary)' }}>
            {period === '1D' ? 'Últimas 24h' : period === '7D' ? 'Últimos 7 dias' : period === '1M' ? 'Últimos 30 dias' : period === '3M' ? 'Últimos 3 meses' : period === '1A' ? 'Último ano' : 'Todo o período'}
          </span>
        </div>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#E5251A" stopOpacity={0.15} />
              <stop offset="70%"  stopColor="#E5251A" stopOpacity={0.03} />
              <stop offset="100%" stopColor="#E5251A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgba(20,20,20,0.04)" strokeWidth={1} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#7A7A82', fontFamily: "'JetBrains Mono', monospace" }}
            tickLine={false} axisLine={false}
            interval="preserveStartEnd"
            tickFormatter={(v) => { const d = new Date(v); return `${d.getDate()}/${d.getMonth()+1}`; }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(20,20,20,0.12)', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Area type="monotone" dataKey="value" stroke="var(--red)" strokeWidth={1.5} fill="url(#dashGrad)" dot={false}
            activeDot={{ r: 4, fill: 'var(--red)', strokeWidth: 2, stroke: '#FAFAF7' }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
