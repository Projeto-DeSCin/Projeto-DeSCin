import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { PortfolioPoint } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-card-border rounded-input shadow-card px-3 py-2">
      <p className="text-xs text-gray-400 mb-0.5">{label ? formatDate(label) : ''}</p>
      <p className="font-mono font-medium text-ink text-sm">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

interface PortfolioChartProps {
  data: PortfolioPoint[];
}

export function PortfolioChart({ data }: PortfolioChartProps) {
  const chartData = data.map(p => ({ date: p.timestamp, value: p.value }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.18} />
            <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: '#9CA3AF', fontFamily: 'DM Sans' }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
          tickFormatter={v => {
            const d = new Date(v);
            return `${d.getDate()}/${d.getMonth() + 1}`;
          }}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#9CA3AF', fontFamily: 'DM Mono' }}
          tickLine={false}
          axisLine={false}
          width={70}
          tickFormatter={v => `R$${(v / 1000).toFixed(1)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#7C3AED"
          strokeWidth={2}
          fill="url(#portfolioGrad)"
          dot={false}
          activeDot={{ r: 4, fill: '#7C3AED', strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
