import { useNavigate } from 'react-router-dom';
import type { Asset } from '../../types';
import { getTickerColor } from '../../utils/color';
import { formatCurrency, formatNumber } from '../../utils/format';
import { ChangeBadge } from '../ui/Badge';
import { Sparkline } from '../charts/Sparkline';
import { TickerLabel } from '../ui/TickerLabel';

interface AssetRowProps {
  asset: Asset;
  showActions?: boolean;
}

export function AssetRow({ asset, showActions = false }: AssetRowProps) {
  const navigate = useNavigate();
  const color = getTickerColor(asset.ticker);
  const code = asset.ticker.split(':')[1];

  return (
    <div className="flex items-center gap-4 py-4 px-6 hover:bg-surface transition-all duration-150 border-b border-card-border last:border-b-0">
      <div
        className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-xs font-mono"
        style={{ background: color }}
      >
        {code.slice(0, 2)}
      </div>

      <div className="flex-1 min-w-0">
        <TickerLabel ticker={asset.ticker} size="sm" />
        <p className="text-xs text-gray-400 mt-0.5 truncate">{asset.projectName}</p>
      </div>

      <div className="hidden sm:block text-right">
        <p className="font-mono text-sm text-gray-600">{formatNumber(asset.tokensOwned)}</p>
        <p className="text-xs text-gray-400">tokens</p>
      </div>

      <div className="text-right">
        <p className="font-mono text-sm font-medium text-ink">{formatCurrency(asset.currentValue)}</p>
        <ChangeBadge value={asset.change24h} showIcon={false} />
      </div>

      <div className="hidden md:block">
        <Sparkline data={asset.priceHistory} positive={asset.change24h >= 0} />
      </div>

      {showActions && (
        <div className="hidden lg:flex gap-2">
          <button
            onClick={() => navigate(`/projetos/${code}`)}
            className="text-xs font-medium text-violet-600 hover:text-violet-700 transition-colors"
          >
            Ver projeto
          </button>
        </div>
      )}
    </div>
  );
}
