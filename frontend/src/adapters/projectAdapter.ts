import type { Project, Area } from '../types';

export interface ApiProjectRaw {
  id: number;
  name: string;
  knowledge_area: string;
  institution: string;
  resume: string;
  description: string;
  status: string;
  initial_token_price: number;
  total_funding: number;
  target_funding: number;
  founders_percentage: number;
  community_percentage: number;
  liquidity_percentage: number;
  reserved_percentage: number;
  investors_count: number;
  roi_estimate: number;
  created_at: string;
  updated_at: string;
}

const AREA_MAP: Record<string, Area> = {
  technology: 'Tecnologia', tecnologia: 'Tecnologia',
  health: 'Saúde', saude: 'Saúde', 'saúde': 'Saúde',
  engineering: 'Engenharia', engenharia: 'Engenharia',
  humanities: 'Humanas', humanas: 'Humanas',
  sciences: 'Ciências', ciencias: 'Ciências', 'ciências': 'Ciências',
  sustainability: 'Sustentabilidade', sustentabilidade: 'Sustentabilidade',
};

export function adaptProjectFromApi(p: ApiProjectRaw): Project {
  const area = AREA_MAP[p.knowledge_area?.toLowerCase()] ?? 'Tecnologia';
  const ticker = `PROJ:${p.name.replace(/\s+/g, '').toUpperCase().slice(0, 8)}${p.id}`;
  const totalSupply = p.target_funding > 0 && p.initial_token_price > 0
    ? Math.round(p.target_funding / p.initial_token_price) : 100000;
  const availableTokens = Math.max(0, totalSupply - (p.investors_count * 10));
  return {
    ticker, name: p.name, university: p.institution || 'Universidade',
    area, description: p.resume || p.description || '',
    descriptionLong: p.description, totalSupply, availableTokens,
    currentPrice: p.initial_token_price || 1.0, initialPrice: p.initial_token_price || 1.0,
    change24h: 0, volume: p.total_funding || 0, team: [],
    tokenomics: { founders: p.founders_percentage || 20, community: p.community_percentage || 50,
      liquidity: p.liquidity_percentage || 20, reserve: p.reserved_percentage || 10 },
    status: (p.status as Project['status']) || 'pending',
    founderId: '', founderName: '', submittedAt: p.created_at,
    approvedAt: p.status === 'approved' ? p.updated_at : undefined,
    updates: [], curationHistory: [],
  };
}

export function adaptProjectToApi(p: Partial<Project>) {
  return {
    name: p.name, knowledge_area: p.area?.toLowerCase(), institution: p.university,
    resume: p.description, description: p.descriptionLong || p.description,
    status: p.status || 'pending', initial_token_price: p.initialPrice || p.currentPrice || 1.0,
    target_funding: (p.totalSupply || 0) * (p.initialPrice || 1.0),
    founders_percentage: p.tokenomics?.founders || 20, community_percentage: p.tokenomics?.community || 50,
    liquidity_percentage: p.tokenomics?.liquidity || 20, reserved_percentage: p.tokenomics?.reserve || 10,
  };
}
