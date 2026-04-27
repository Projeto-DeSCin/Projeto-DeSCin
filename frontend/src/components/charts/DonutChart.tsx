import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutSlice[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: DonutSlice }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="bg-white border border-card-border rounded-input shadow-card px-3 py-2">
      <p className="text-xs font-medium text-ink">{item.label}</p>
      <p className="font-mono text-sm text-gray-600">{item.value.toLocaleString('pt-BR')} tokens</p>
    </div>
  );
}

export function DonutChart({ data }: DonutChartProps) {
  return (
    <div className="flex gap-6 items-center">
      <ResponsiveContainer width={180} height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={54}
            outerRadius={80}
            dataKey="value"
            nameKey="label"
            strokeWidth={2}
            stroke="#fff"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <ul className="space-y-2 flex-1">
        {data.map((entry, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ background: entry.color }}
            />
            <span className="text-gray-600">{entry.label}</span>
            <span className="ml-auto font-mono text-ink font-medium">
              {((entry.value / data.reduce((s, d) => s + d.value, 0)) * 100).toFixed(1)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
