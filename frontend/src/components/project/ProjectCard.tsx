import { useNavigate } from 'react-router-dom';
import type { Project } from '../../types';
import { getTickerColor, getTickerInitials } from '../../utils/color';
import { formatCurrency, formatChange, formatNumber } from '../../utils/format';
import { ChangeBadge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();
  const color = getTickerColor(project.ticker);
  const initials = getTickerInitials(project.ticker);
  const soldPercent = Math.round(
    ((project.totalSupply - project.availableTokens) / project.totalSupply) * 100,
  );
  const code = project.ticker.split(':')[1];

  return (
    <div className="bg-white border border-card-border rounded-card shadow-card flex flex-col overflow-hidden transition-all duration-150 hover:shadow-card-hover hover:-translate-y-0.5">
      <div className="h-16 flex items-center px-5 gap-3" style={{ background: `${color}18` }}>
        <div
          className="w-10 h-10 rounded-input flex items-center justify-center text-white font-bold text-sm font-mono flex-shrink-0"
          style={{ background: color }}
        >
          {initials}
        </div>
        <div className="min-w-0">
          <p className="font-mono text-xs font-medium" style={{ color }}>
            {project.ticker}
          </p>
          <p className="text-xs text-gray-400 truncate">{project.area}</p>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="font-display font-bold text-ink text-sm leading-tight mb-0.5 line-clamp-2">
            {project.name}
          </h3>
          <p className="text-xs text-gray-400">{project.university}</p>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Preço do token</p>
            <p className="font-mono font-semibold text-ink">{formatCurrency(project.currentPrice)}</p>
          </div>
          <ChangeBadge value={project.change24h} />
        </div>

        <div className="text-xs text-gray-400">
          Volume: <span className="font-mono text-ink">{formatNumber(project.volume)}</span>
        </div>

        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Tokens vendidos</span>
            <span className="font-mono">{soldPercent}%</span>
          </div>
          <div className="h-1.5 bg-card rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${soldPercent}%`, background: color }}
            />
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          className="w-full mt-auto"
          onClick={() => navigate(`/projetos/${code}`)}
        >
          Ver projeto
        </Button>
      </div>
    </div>
  );
}
