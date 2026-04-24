import { useState, useEffect } from 'react';
import type { Project } from '../types';
import { projectsService } from '../services/projects';

export function useProject(ticker: string | undefined) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ticker) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    projectsService
      .getByTicker(ticker)
      .then(data => { if (!cancelled) setProject(data); })
      .catch(() => { if (!cancelled) setError('Projeto não encontrado'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [ticker]);

  return { project, loading, error };
}
