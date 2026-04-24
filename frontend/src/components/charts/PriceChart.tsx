import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { PricePoint } from '../../types';
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

interface PriceChartProps {
  data: PricePoint[];
  change24h: number;
}

export function PriceChart({ data, change24h }: PriceChartProps) {
  const positive = change24h >= 0;
  const color = positive ? '#10B981' : '#EF4444';
  const gradientId = positive ? 'priceGradGreen' : 'priceGradRed';
  const chartData = data.map(p => ({ date: p.timestamp, price: p.price }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.15} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
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
          width={60}
          tickFormatter={v => `R$${v.toFixed(2)}`}
          domain={['auto', 'auto']}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="price"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
