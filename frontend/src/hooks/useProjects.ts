import { useState, useEffect } from 'react';
import type { Project } from '../types';
import { projectsService } from '../services/projects';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    projectsService
      .getAll()
      .then(data => { if (!cancelled) setProjects(data); })
      .catch(() => { if (!cancelled) setError('Falha ao carregar projetos'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { projects, loading, error };
}
