import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { ProjectCard } from '../components/project/ProjectCard';
import { SkeletonCard } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { useProjects } from '../hooks/useProjects';
import { AREAS, SORT_OPTIONS } from '../constants';
import type { Area, SortBy, Project } from '../types';

function sortProjects(projects: Project[], sortBy: SortBy): Project[] {
  return [...projects].sort((a, b) => {
    if (sortBy === 'volume') return b.volume - a.volume;
    if (sortBy === 'change') return b.change24h - a.change24h;
    return 0;
  });
}

export default function Explorar() {
  const { projects, loading } = useProjects();
  const [search, setSearch] = useState('');
  const [area, setArea] = useState<Area>('Todas');
  const [sortBy, setSortBy] = useState<SortBy>('volume');

  const filtered = useMemo(() => {
    let result = projects;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.ticker.toLowerCase().includes(q) ||
          p.university.toLowerCase().includes(q),
      );
    }
    if (area !== 'Todas') {
      result = result.filter(p => p.area === area);
    }
    return sortProjects(result, sortBy);
  }, [projects, search, area, sortBy]);

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="font-display font-bold text-3xl text-ink mb-1">Explorar Projetos</h1>
        <p className="text-gray-400 text-sm">
          {projects.length} projetos disponíveis para investimento
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, ticker ou universidade..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-card-border rounded-input bg-white text-sm text-ink placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-150"
          />
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <SlidersHorizontal size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={area}
              onChange={e => setArea(e.target.value as Area)}
              className="pl-8 pr-3 py-2.5 border border-card-border rounded-input bg-white text-sm text-ink focus:outline-none focus:ring-2 focus:ring-violet-500 appearance-none cursor-pointer"
            >
              {AREAS.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortBy)}
            className="px-3 py-2.5 border border-card-border rounded-input bg-white text-sm text-ink focus:outline-none focus:ring-2 focus:ring-violet-500 appearance-none cursor-pointer"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Search size={24} />}
          title="Nenhum projeto encontrado"
          description="Tente ajustar os filtros ou buscar por outro termo."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(project => (
            <ProjectCard key={project.ticker} project={project} />
          ))}
        </div>
      )}
    </AppLayout>
  );
}
