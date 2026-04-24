import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface SparklineProps {
  data: number[];
  positive?: boolean;
}

export function Sparkline({ data, positive = true }: SparklineProps) {
  const chartData = data.map((v, i) => ({ i, v }));
  const color = positive ? '#10B981' : '#EF4444';

  return (
    <ResponsiveContainer width={80} height={32}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
