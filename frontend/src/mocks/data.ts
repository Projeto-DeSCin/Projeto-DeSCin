import type { Project, Asset, WalletData, Transaction, PricePoint, PortfolioPoint } from '../types';

function createRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function generatePriceHistory(seed: number, basePrice: number): PricePoint[] {
  const rng = createRng(seed);
  const points: PricePoint[] = [];
  let price = basePrice * (0.55 + rng() * 0.2);
  const today = new Date('2026-04-24');

  for (let i = 365; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const delta = (rng() - 0.47) * 0.07;
    price = Math.max(price * (1 + delta), 0.5);
    points.push({ timestamp: d.toISOString().slice(0, 10), price: +price.toFixed(2) });
  }

  const last = points[points.length - 1].price;
  const scale = basePrice / last;
  return points.map(p => ({ ...p, price: +(p.price * scale).toFixed(2) }));
}

function generatePortfolioHistory(): PortfolioPoint[] {
  const rng = createRng(777);
  const points: PortfolioPoint[] = [];
  let value = 4200;
  const today = new Date('2026-04-24');

  for (let i = 365; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const delta = (rng() - 0.46) * 0.04;
    value = Math.max(value * (1 + delta), 1000);
    points.push({ timestamp: d.toISOString().slice(0, 10), value: +value.toFixed(2) });
  }

  return points;
}

export const MOCK_PROJECTS: Project[] = [
  {
    ticker: 'PROJ:HIDRO24',
    name: 'Sistema de Monitoramento Hídrico Inteligente',
    university: 'USP São Carlos',
    area: 'Engenharia',
    description:
      'Sensores IoT e algoritmos de ML para monitoramento em tempo real de bacias hidrográficas, com previsão de cheias com 72h de antecedência. O sistema integra dados pluviométricos, sensores de nível e modelos hidrológicos para gestão eficiente de recursos hídricos em regiões metropolitanas, potencialmente reduzindo perdas em 35%.',
    totalSupply: 100000,
    availableTokens: 43000,
    currentPrice: 4.85,
    change24h: 2.3,
    volume: 152300,
    team: [
      { name: 'Prof. Dr. Carlos Mendes', role: 'Coordenador Científico' },
      { name: 'Dra. Ana Paula Silva', role: 'Engenharia de Sensores' },
      { name: 'MSc. Ricardo Alves', role: 'Machine Learning' },
    ],
  },
  {
    ticker: 'PROJ:ROBO25',
    name: 'Plataforma de Robótica Educacional Autônoma',
    university: 'UNICAMP',
    area: 'Tecnologia',
    description:
      'Kit de robótica de baixo custo com IA embarcada para escolas públicas, com plataforma de programação visual e currículo alinhado à BNCC. O projeto visa democratizar o ensino de lógica e computação no ensino fundamental e médio da rede pública.',
    totalSupply: 80000,
    availableTokens: 28000,
    currentPrice: 6.2,
    change24h: -1.1,
    volume: 89400,
    team: [
      { name: 'Prof. Dr. Rafael Costa', role: 'Coordenador' },
      { name: 'Eng. Marina Lopes', role: 'Hardware Embarcado' },
      { name: 'MSc. João Pedro Lima', role: 'Software e Firmware' },
    ],
  },
  {
    ticker: 'PROJ:BIOM24',
    name: 'Biomonitor de Sinais Vitais Wearable',
    university: 'UNIFESP',
    area: 'Saúde',
    description:
      'Dispositivo vestível de baixo custo para monitoramento contínuo de frequência cardíaca, saturação de oxigênio e temperatura corporal. Algoritmos embarcados de detecção precoce de arritmias com transmissão em tempo real para plataformas de telemedicina.',
    totalSupply: 60000,
    availableTokens: 15000,
    currentPrice: 3.4,
    change24h: 0.8,
    volume: 45600,
    team: [
      { name: 'Profa. Dra. Sandra Ferreira', role: 'Coordenadora Médica' },
      { name: 'Dr. Felipe Santos', role: 'Bioengenharia' },
      { name: 'MSc. Camila Torres', role: 'Firmware e DSP' },
    ],
  },
  {
    ticker: 'PROJ:SOLA25',
    name: 'Minigerador Solar para Comunidades Rurais',
    university: 'UFRJ',
    area: 'Engenharia',
    description:
      'Sistema fotovoltaico modular de baixo custo para eletrificação de comunidades rurais sem acesso à rede elétrica. Integra baterias de segunda vida reaproveitadas da indústria automotiva e sistema de gestão energética IoT para otimização inteligente do consumo.',
    totalSupply: 120000,
    availableTokens: 67000,
    currentPrice: 7.5,
    change24h: 4.2,
    volume: 234100,
    team: [
      { name: 'Prof. Dr. Marcelo Barbosa', role: 'Coordenador' },
      { name: 'Dra. Luciana Melo', role: 'Sistemas Fotovoltaicos' },
      { name: 'Eng. Bruno Carvalho', role: 'Sistemas Embarcados' },
    ],
  },
  {
    ticker: 'PROJ:NEURO24',
    name: 'Análise Preditiva de Doenças Neurodegenerativas',
    university: 'USP',
    area: 'Saúde',
    description:
      'Sistema de IA para detecção precoce de Alzheimer e Parkinson através de análise de biomarcadores em exames de ressonância magnética e dados de wearables. Validado em coorte de 2.400 pacientes do HC-FMUSP com sensibilidade de 91% e especificidade de 88%.',
    totalSupply: 90000,
    availableTokens: 22000,
    currentPrice: 8.4,
    change24h: -2.1,
    volume: 178900,
    team: [
      { name: 'Prof. Dr. Alexandre Nobre', role: 'Coordenador Científico' },
      { name: 'Dra. Isabela Fonseca', role: 'Neurologia Clínica' },
      { name: 'Dr. Pedro Lemos', role: 'Inteligência Artificial' },
    ],
  },
  {
    ticker: 'PROJ:AGRO25',
    name: 'Agricultura de Precisão com Visão Computacional',
    university: 'ESALQ/USP',
    area: 'Tecnologia',
    description:
      'Drones com visão computacional e modelos de deep learning para detecção precoce de doenças em lavouras de soja e milho. Gera mapas de tratamento sítio-específico que reduzem em 40% o uso de defensivos agrícolas, diminuindo custo e impacto ambiental.',
    totalSupply: 75000,
    availableTokens: 38000,
    currentPrice: 5.1,
    change24h: 1.5,
    volume: 67800,
    team: [
      { name: 'Prof. Dr. Eduardo Prado', role: 'Coordenador' },
      { name: 'Dra. Fernanda Vieira', role: 'Fitopatologia' },
      { name: 'MSc. Lucas Machado', role: 'Visão Computacional' },
    ],
  },
  {
    ticker: 'PROJ:CULT24',
    name: 'Mapeamento Digital do Patrimônio Cultural',
    university: 'UFMG',
    area: 'Humanas',
    description:
      'Digitalização 3D de bens culturais imateriais e arquitetônicos de Minas Gerais usando fotogrametria e realidade aumentada. Plataforma aberta de acesso ao patrimônio histórico para pesquisadores, educadores e público geral, com suporte a visitas virtuais.',
    totalSupply: 50000,
    availableTokens: 31000,
    currentPrice: 2.8,
    change24h: 0.3,
    volume: 23400,
    team: [
      { name: 'Profa. Dra. Helena Drummond', role: 'Coordenadora' },
      { name: 'Dr. Renato Castro', role: 'Patrimônio Histórico' },
      { name: 'MSc. Beatriz Oliveira', role: 'Computação Gráfica' },
    ],
  },
  {
    ticker: 'PROJ:QUIM25',
    name: 'Catalisadores Verdes para Síntese Orgânica',
    university: 'ITA',
    area: 'Ciências',
    description:
      'Nanopartículas de óxidos metálicos como catalisadores para reações de síntese orgânica em água, eliminando solventes tóxicos. Aplicações diretas na indústria farmacêutica e de agroquímicos, com potencial de reduzir resíduos químicos em 60%.',
    totalSupply: 150000,
    availableTokens: 89000,
    currentPrice: 9.2,
    change24h: -0.7,
    volume: 312000,
    team: [
      { name: 'Prof. Dr. Henrique Campos', role: 'Coordenador' },
      { name: 'Dra. Vanessa Rocha', role: 'Catálise Heterogênea' },
      { name: 'MSc. Thiago Assis', role: 'Síntese de Nanomateriais' },
    ],
  },
];

export const MOCK_PRICE_HISTORIES: Record<string, PricePoint[]> = {
  'PROJ:HIDRO24': generatePriceHistory(1001, 4.85),
  'PROJ:ROBO25': generatePriceHistory(2002, 6.2),
  'PROJ:BIOM24': generatePriceHistory(3003, 3.4),
  'PROJ:SOLA25': generatePriceHistory(4004, 7.5),
  'PROJ:NEURO24': generatePriceHistory(5005, 8.4),
  'PROJ:AGRO25': generatePriceHistory(6006, 5.1),
  'PROJ:CULT24': generatePriceHistory(7007, 2.8),
  'PROJ:QUIM25': generatePriceHistory(8008, 9.2),
};

export const MOCK_PORTFOLIO_HISTORY: PortfolioPoint[] = generatePortfolioHistory();

export const MOCK_WALLET: WalletData = {
  availableBalance: 1235.5,
  totalInvested: 5965.0,
  assets: [
    {
      ticker: 'PROJ:HIDRO24',
      projectName: 'Sistema de Monitoramento Hídrico Inteligente',
      tokensOwned: 500,
      currentValue: 2425.0,
      change24h: 2.3,
      priceHistory: MOCK_PRICE_HISTORIES['PROJ:HIDRO24'].slice(-7).map(p => p.price),
    },
    {
      ticker: 'PROJ:ROBO25',
      projectName: 'Plataforma de Robótica Educacional Autônoma',
      tokensOwned: 300,
      currentValue: 1860.0,
      change24h: -1.1,
      priceHistory: MOCK_PRICE_HISTORIES['PROJ:ROBO25'].slice(-7).map(p => p.price),
    },
    {
      ticker: 'PROJ:NEURO24',
      projectName: 'Análise Preditiva de Doenças Neurodegenerativas',
      tokensOwned: 200,
      currentValue: 1680.0,
      change24h: -2.1,
      priceHistory: MOCK_PRICE_HISTORIES['PROJ:NEURO24'].slice(-7).map(p => p.price),
    },
  ],
};

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    hash: '0x3f8a1b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    type: 'buy',
    ticker: 'PROJ:NEURO24',
    projectName: 'Análise Preditiva de Doenças Neurodegenerativas',
    amount: 200,
    value: 1680.0,
    timestamp: '2026-04-20T14:32:11Z',
  },
  {
    hash: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
    type: 'deposit',
    amount: 2000,
    value: 2000.0,
    timestamp: '2026-04-18T09:15:00Z',
  },
  {
    hash: '0xb2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
    type: 'buy',
    ticker: 'PROJ:ROBO25',
    projectName: 'Plataforma de Robótica Educacional Autônoma',
    amount: 150,
    value: 930.0,
    timestamp: '2026-04-15T16:48:33Z',
  },
  {
    hash: '0xc3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5',
    type: 'buy',
    ticker: 'PROJ:HIDRO24',
    projectName: 'Sistema de Monitoramento Hídrico Inteligente',
    amount: 300,
    value: 1455.0,
    timestamp: '2026-04-10T11:22:05Z',
  },
  {
    hash: '0xd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
    type: 'deposit',
    amount: 3000,
    value: 3000.0,
    timestamp: '2026-04-08T08:00:00Z',
  },
  {
    hash: '0xe5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7',
    type: 'buy',
    ticker: 'PROJ:ROBO25',
    projectName: 'Plataforma de Robótica Educacional Autônoma',
    amount: 150,
    value: 894.0,
    timestamp: '2026-04-05T13:10:22Z',
  },
  {
    hash: '0xf6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8',
    type: 'buy',
    ticker: 'PROJ:HIDRO24',
    projectName: 'Sistema de Monitoramento Hídrico Inteligente',
    amount: 200,
    value: 920.0,
    timestamp: '2026-03-28T10:44:17Z',
  },
  {
    hash: '0xa7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9',
    type: 'deposit',
    amount: 2500,
    value: 2500.0,
    timestamp: '2026-03-20T09:00:00Z',
  },
];
