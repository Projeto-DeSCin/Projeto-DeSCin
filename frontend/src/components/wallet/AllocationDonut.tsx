import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useWalletStore } from '../../stores/wallet.store';
import { useProjectStore } from '../../stores/project.store';
import { getAllocationColor } from '../../utils/color';
import { formatCurrency } from '../../utils/format';

interface SliceItem {
  name: string;
  value: number;
  percent: number;
  color: string;
  isAvailable?: boolean;
}

function LegendRow({ item }: { item: SliceItem }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        <span style={{
          width: 10, height: 10, borderRadius: 2, flexShrink: 0, display: 'inline-block',
          background: item.color,
        }} />
        <span style={{ color: item.isAvailable ? 'var(--ink-muted)' : 'var(--ink-primary)', fontWeight: item.isAvailable ? 400 : 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.isAvailable ? item.name : item.name.replace('PROJ:', '')}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <span style={{ color: 'var(--ink-secondary)', fontVariantNumeric: 'tabular-nums' }}>
          {item.percent.toFixed(1)}%
        </span>
        <span style={{ color: item.isAvailable ? 'var(--ink-muted)' : 'var(--ink-primary)', fontVariantNumeric: 'tabular-nums', minWidth: 80, textAlign: 'right' }}>
          {formatCurrency(item.value)}
        </span>
      </div>
    </div>
  );
}

function EmptyAllocation() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, textAlign: 'center' }}>
      <div style={{
        width: 128, height: 128, borderRadius: '50%', marginBottom: 16,
        background: 'rgba(20,20,20,0.04)', border: '1.5px dashed var(--rule)',
      }} />
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
        Sem alocação
      </span>
    </div>
  );
}

export function AllocationDonut() {
  const { assets, availableBalance } = useWalletStore();
  const liveProjects = useProjectStore(s => s.projects);

  const data = useMemo<SliceItem[]>(() => {
    // Compute current value using live prices
    const assetsWithLiveValue = assets.map(asset => {
      const live = liveProjects.find(p => p.ticker === asset.ticker);
      const liveValue = live ? asset.tokensOwned * live.currentPrice : asset.currentValue;
      return { ...asset, currentValue: liveValue };
    });

    const totalInvested = assetsWithLiveValue.reduce((s, a) => s + a.currentValue, 0);
    const total = totalInvested + availableBalance;
    if (total === 0) return [];

    const sorted = [...assetsWithLiveValue].sort((a, b) => b.currentValue - a.currentValue);
    const largestTicker = sorted[0]?.ticker;

    const slices: SliceItem[] = assetsWithLiveValue.map((asset, i) => ({
      name: asset.ticker,
      value: asset.currentValue,
      percent: (asset.currentValue / total) * 100,
      color: getAllocationColor(i, asset.ticker === largestTicker),
    }));

    if (availableBalance > 0) {
      slices.push({
        name: 'Disponível',
        value: availableBalance,
        percent: (availableBalance / total) * 100,
        color: 'rgba(20, 20, 20, 0.15)',
        isAvailable: true,
      });
    }

    return slices.filter(s => s.value > 0);
  }, [assets, availableBalance, liveProjects]);

  if (data.length === 0) return <EmptyAllocation />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ marginBottom: 24 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: 4 }}>
          Alocação
        </span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-primary)', fontWeight: 600 }}>
          Por ativo
        </span>
      </div>

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 260 }}>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              cx="50%" cy="50%"
              innerRadius={78} outerRadius={118}
              paddingAngle={2}
              dataKey="value"
              startAngle={90} endAngle={-270}
              isAnimationActive animationDuration={800} animationEasing="ease-out"
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={entry.color}
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth={1}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
        }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 4 }}>
            Investido
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: 'var(--ink-primary)' }}>
            {formatCurrency(data.filter(s => !s.isAvailable).reduce((s, a) => s + a.value, 0))}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
        {data.map(item => <LegendRow key={item.name} item={item} />)}
      </div>
    </div>
  );
}
