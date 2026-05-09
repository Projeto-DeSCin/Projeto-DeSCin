import type {
  Project,
  User,
  WalletData,
  Transaction,
  PricePoint,
  PortfolioPoint,
  Area,
} from '../types';

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
  const today = new Date('2026-05-07');

  for (let i = 365; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const delta = (rng() - 0.47) * 0.07;
    price = Math.max(price * (1 + delta), 0.5);
    points.push({ timestamp: d.toISOString().slice(0, 10), price: +price.toFixed(2) });
  }

  const last = points[points.length - 1].price;
  const scale = basePrice / last;
  return points.map((p) => ({ ...p, price: +(p.price * scale).toFixed(2) }));
}

function generatePortfolioHistory(): PortfolioPoint[] {
  const rng = createRng(777);
  const points: PortfolioPoint[] = [];
  let value = 4200;
  const today = new Date('2026-05-07');

  for (let i = 365; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const delta = (rng() - 0.46) * 0.04;
    value = Math.max(value * (1 + delta), 1000);
    points.push({ timestamp: d.toISOString().slice(0, 10), value: +value.toFixed(2) });
  }

  return points;
}

interface MockUser extends User {
  password: string;
}

export const MOCK_USERS: MockUser[] = [
  {
    id: 'user_investor',
    name: 'Maria Investidora',
    email: 'investor@descin.com',
    roles: ['investor'],
    createdAt: '2025-01-15T10:00:00Z',
    password: '123456',
  },
  {
    id: 'user_founder',
    name: 'Carlos Fundador',
    email: 'founder@descin.com',
    roles: ['investor', 'founder'],
    bio: 'Pesquisador em IoT e sistemas embarcados na USP',
    createdAt: '2024-08-20T14:30:00Z',
    password: '123456',
  },
  {
    id: 'user_curator',
    name: 'Ana Curadora',
    email: 'curator@descin.com',
    roles: ['investor', 'curator'],
    bio: 'Professora de Engenharia na UNICAMP',
    createdAt: '2024-06-10T09:00:00Z',
    password: '123456',
  },
  {
    id: 'user_admin',
    name: 'Bernardo Admin',
    email: 'admin@descin.com',
    roles: ['investor', 'founder', 'curator'],
    bio: 'Administrador da plataforma DeSCin',
    createdAt: '2024-01-01T00:00:00Z',
    password: '123456',
  },
];

export const MOCK_PROJECTS: Project[] = [
  {
    ticker: 'PROJ:HIDRO24',
    name: 'Sistema de Monitoramento Hídrico Inteligente',
    university: 'USP São Carlos',
    area: 'Engenharia',
    description:
      'Sensores IoT e algoritmos de ML para monitoramento em tempo real de bacias hidrográficas, com previsão de cheias com 72h de antecedência.',
    descriptionLong: `O sistema integra dados pluviométricos, sensores de nível e modelos hidrológicos para gestão eficiente de recursos hídricos em regiões metropolitanas, potencialmente reduzindo perdas em 35%.

A solução utiliza uma rede de sensores de baixo custo conectados via LoRaWAN, permitindo cobertura ampla mesmo em áreas remotas. Os dados são processados em tempo real por modelos de machine learning treinados com décadas de dados históricos.

O projeto já possui validação piloto em 3 bacias da região de Campinas, demonstrando precisão de 94% nas previsões de nível de água.`,
    totalSupply: 100000,
    availableTokens: 43000,
    currentPrice: 4.85,
    initialPrice: 3.0,
    change24h: 2.3,
    volume: 152300,
    team: [
      { name: 'Prof. Dr. Carlos Mendes', role: 'Coordenador Científico', link: 'https://lattes.cnpq.br' },
      { name: 'Dra. Ana Paula Silva', role: 'Engenharia de Sensores' },
      { name: 'MSc. Ricardo Alves', role: 'Machine Learning' },
    ],
    tokenomics: { founders: 20, community: 50, liquidity: 20, reserve: 10 },
    status: 'approved',
    founderId: 'user_founder',
    founderName: 'Carlos Fundador',
    submittedAt: '2024-03-15T10:00:00Z',
    approvedAt: '2024-03-20T14:00:00Z',
    updates: [
      {
        id: 'upd_1',
        title: 'Validação piloto concluída',
        content: 'Finalizamos os testes em 3 bacias com resultados excelentes.',
        createdAt: '2026-04-15T10:00:00Z',
      },
    ],
    curationHistory: [
      {
        id: 'cur_1',
        action: 'approved',
        curatorId: 'user_curator',
        curatorName: 'Ana Curadora',
        createdAt: '2024-03-20T14:00:00Z',
      },
    ],
  },
  {
    ticker: 'PROJ:ROBO25',
    name: 'Plataforma de Robótica Educacional Autônoma',
    university: 'UNICAMP',
    area: 'Tecnologia',
    description:
      'Kit de robótica de baixo custo com IA embarcada para escolas públicas, com plataforma de programação visual e currículo alinhado à BNCC.',
    descriptionLong: `O projeto visa democratizar o ensino de lógica e computação no ensino fundamental e médio da rede pública.

Cada kit inclui um robô modular que pode ser montado de diferentes formas, sensores de distância e cor, e uma placa de controle com microprocessador ARM. A programação é feita via interface visual no navegador, sem necessidade de instalação.

Já distribuímos 500 kits para escolas em 12 municípios paulistas, impactando mais de 15.000 estudantes.`,
    totalSupply: 80000,
    availableTokens: 28000,
    currentPrice: 6.2,
    initialPrice: 4.5,
    change24h: -1.1,
    volume: 89400,
    team: [
      { name: 'Prof. Dr. Rafael Costa', role: 'Coordenador' },
      { name: 'Eng. Marina Lopes', role: 'Hardware Embarcado' },
      { name: 'MSc. João Pedro Lima', role: 'Software e Firmware' },
    ],
    tokenomics: { founders: 25, community: 45, liquidity: 20, reserve: 10 },
    status: 'approved',
    founderId: 'user_founder',
    founderName: 'Carlos Fundador',
    submittedAt: '2024-06-10T09:00:00Z',
    approvedAt: '2024-06-15T11:00:00Z',
    updates: [],
    curationHistory: [
      {
        id: 'cur_2',
        action: 'approved',
        curatorId: 'user_curator',
        curatorName: 'Ana Curadora',
        createdAt: '2024-06-15T11:00:00Z',
      },
    ],
  },
  {
    ticker: 'PROJ:BIOM24',
    name: 'Biomonitor de Sinais Vitais Wearable',
    university: 'UNIFESP',
    area: 'Saúde',
    description:
      'Dispositivo vestível de baixo custo para monitoramento contínuo de frequência cardíaca, saturação de oxigênio e temperatura corporal.',
    descriptionLong: `Algoritmos embarcados de detecção precoce de arritmias com transmissão em tempo real para plataformas de telemedicina.

O dispositivo foi projetado para uso contínuo por pacientes de risco, com bateria de 7 dias e resistência à água. Os dados são sincronizados automaticamente com o prontuário eletrônico do paciente.

Validação clínica realizada com 850 pacientes do Hospital São Paulo demonstrou sensibilidade de 96% na detecção de fibrilação atrial.`,
    totalSupply: 60000,
    availableTokens: 15000,
    currentPrice: 3.4,
    initialPrice: 2.0,
    change24h: 0.8,
    volume: 45600,
    team: [
      { name: 'Profa. Dra. Sandra Ferreira', role: 'Coordenadora Médica' },
      { name: 'Dr. Felipe Santos', role: 'Bioengenharia' },
      { name: 'MSc. Camila Torres', role: 'Firmware e DSP' },
    ],
    tokenomics: { founders: 15, community: 55, liquidity: 20, reserve: 10 },
    status: 'approved',
    founderId: 'user_admin',
    founderName: 'Bernardo Admin',
    submittedAt: '2024-02-01T08:00:00Z',
    approvedAt: '2024-02-10T16:00:00Z',
    updates: [],
    curationHistory: [],
  },
  {
    ticker: 'PROJ:SOLA25',
    name: 'Minigerador Solar para Comunidades Rurais',
    university: 'UFRJ',
    area: 'Sustentabilidade',
    description:
      'Sistema fotovoltaico modular de baixo custo para eletrificação de comunidades rurais sem acesso à rede elétrica.',
    descriptionLong: `Integra baterias de segunda vida reaproveitadas da indústria automotiva e sistema de gestão energética IoT para otimização inteligente do consumo.

O sistema pode alimentar até 5 residências com potência de 2kWp, incluindo iluminação, refrigeração básica e carregamento de dispositivos. A instalação é simplificada e não requer mão de obra especializada.

Projeto piloto em comunidade quilombola no Vale do Ribeira já beneficia 45 famílias há 18 meses.`,
    totalSupply: 120000,
    availableTokens: 67000,
    currentPrice: 7.5,
    initialPrice: 5.0,
    change24h: 4.2,
    volume: 234100,
    team: [
      { name: 'Prof. Dr. Marcelo Barbosa', role: 'Coordenador' },
      { name: 'Dra. Luciana Melo', role: 'Sistemas Fotovoltaicos' },
      { name: 'Eng. Bruno Carvalho', role: 'Sistemas Embarcados' },
    ],
    tokenomics: { founders: 20, community: 50, liquidity: 20, reserve: 10 },
    status: 'approved',
    founderId: 'user_admin',
    founderName: 'Bernardo Admin',
    submittedAt: '2024-04-20T10:00:00Z',
    approvedAt: '2024-04-28T09:00:00Z',
    updates: [],
    curationHistory: [],
  },
  {
    ticker: 'PROJ:NEURO24',
    name: 'Análise Preditiva de Doenças Neurodegenerativas',
    university: 'USP',
    area: 'Saúde',
    description:
      'Sistema de IA para detecção precoce de Alzheimer e Parkinson através de análise de biomarcadores em exames de ressonância magnética.',
    descriptionLong: `Validado em coorte de 2.400 pacientes do HC-FMUSP com sensibilidade de 91% e especificidade de 88%.

O sistema combina análise de imagens de RM com dados de wearables (padrões de marcha, tremores, qualidade do sono) para gerar um score de risco personalizado.

A detecção precoce pode antecipar o diagnóstico em até 5 anos, permitindo intervenções que retardam a progressão da doença.`,
    totalSupply: 90000,
    availableTokens: 22000,
    currentPrice: 8.4,
    initialPrice: 6.0,
    change24h: -2.1,
    volume: 178900,
    team: [
      { name: 'Prof. Dr. Alexandre Nobre', role: 'Coordenador Científico' },
      { name: 'Dra. Isabela Fonseca', role: 'Neurologia Clínica' },
      { name: 'Dr. Pedro Lemos', role: 'Inteligência Artificial' },
    ],
    tokenomics: { founders: 15, community: 55, liquidity: 20, reserve: 10 },
    status: 'approved',
    founderId: 'user_admin',
    founderName: 'Bernardo Admin',
    submittedAt: '2024-01-10T08:00:00Z',
    approvedAt: '2024-01-18T14:00:00Z',
    updates: [],
    curationHistory: [],
  },
  {
    ticker: 'PROJ:AGRO25',
    name: 'Agricultura de Precisão com Visão Computacional',
    university: 'ESALQ/USP',
    area: 'Tecnologia',
    description:
      'Drones com visão computacional e modelos de deep learning para detecção precoce de doenças em lavouras de soja e milho.',
    descriptionLong: `Gera mapas de tratamento sítio-específico que reduzem em 40% o uso de defensivos agrícolas, diminuindo custo e impacto ambiental.

O sistema processa imagens multiespectrais capturadas por drones para identificar estresse hídrico, deficiências nutricionais e infestações em estágio inicial.

Atualmente em uso em 15 fazendas no Mato Grosso, cobrindo 45.000 hectares de cultivo.`,
    totalSupply: 75000,
    availableTokens: 38000,
    currentPrice: 5.1,
    initialPrice: 3.5,
    change24h: 1.5,
    volume: 67800,
    team: [
      { name: 'Prof. Dr. Eduardo Prado', role: 'Coordenador' },
      { name: 'Dra. Fernanda Vieira', role: 'Fitopatologia' },
      { name: 'MSc. Lucas Machado', role: 'Visão Computacional' },
    ],
    tokenomics: { founders: 20, community: 50, liquidity: 20, reserve: 10 },
    status: 'approved',
    founderId: 'user_founder',
    founderName: 'Carlos Fundador',
    submittedAt: '2024-05-01T10:00:00Z',
    approvedAt: '2024-05-08T11:00:00Z',
    updates: [],
    curationHistory: [],
  },
  {
    ticker: 'PROJ:CULT24',
    name: 'Mapeamento Digital do Patrimônio Cultural',
    university: 'UFMG',
    area: 'Humanas',
    description:
      'Digitalização 3D de bens culturais imateriais e arquitetônicos de Minas Gerais usando fotogrametria e realidade aumentada.',
    descriptionLong: `Plataforma aberta de acesso ao patrimônio histórico para pesquisadores, educadores e público geral, com suporte a visitas virtuais.

Já digitalizamos 120 edificações históricas, 45 obras de arte sacra e documentamos 30 manifestações culturais imateriais de comunidades tradicionais.

O acervo está disponível gratuitamente online e é utilizado em programas educacionais de 85 escolas mineiras.`,
    totalSupply: 50000,
    availableTokens: 31000,
    currentPrice: 2.8,
    initialPrice: 2.0,
    change24h: 0.3,
    volume: 23400,
    team: [
      { name: 'Profa. Dra. Helena Drummond', role: 'Coordenadora' },
      { name: 'Dr. Renato Castro', role: 'Patrimônio Histórico' },
      { name: 'MSc. Beatriz Oliveira', role: 'Computação Gráfica' },
    ],
    tokenomics: { founders: 15, community: 60, liquidity: 15, reserve: 10 },
    status: 'approved',
    founderId: 'user_admin',
    founderName: 'Bernardo Admin',
    submittedAt: '2024-02-15T09:00:00Z',
    approvedAt: '2024-02-22T10:00:00Z',
    updates: [],
    curationHistory: [],
  },
  {
    ticker: 'PROJ:QUIM25',
    name: 'Catalisadores Verdes para Síntese Orgânica',
    university: 'ITA',
    area: 'Ciências',
    description:
      'Nanopartículas de óxidos metálicos como catalisadores para reações de síntese orgânica em água, eliminando solventes tóxicos.',
    descriptionLong: `Aplicações diretas na indústria farmacêutica e de agroquímicos, com potencial de reduzir resíduos químicos em 60%.

Os catalisadores desenvolvidos são recicláveis por até 15 ciclos sem perda significativa de atividade. A síntese das nanopartículas utiliza precursores abundantes e de baixo custo.

Parceria estabelecida com 3 indústrias farmacêuticas para testes em escala piloto.`,
    totalSupply: 150000,
    availableTokens: 89000,
    currentPrice: 9.2,
    initialPrice: 7.0,
    change24h: -0.7,
    volume: 312000,
    team: [
      { name: 'Prof. Dr. Henrique Campos', role: 'Coordenador' },
      { name: 'Dra. Vanessa Rocha', role: 'Catálise Heterogênea' },
      { name: 'MSc. Thiago Assis', role: 'Síntese de Nanomateriais' },
    ],
    tokenomics: { founders: 20, community: 50, liquidity: 20, reserve: 10 },
    status: 'approved',
    founderId: 'user_admin',
    founderName: 'Bernardo Admin',
    submittedAt: '2024-03-01T08:00:00Z',
    approvedAt: '2024-03-10T14:00:00Z',
    updates: [],
    curationHistory: [],
  },
  {
    ticker: 'PROJ:REAB26',
    name: 'Exoesqueleto de Reabilitação Motora',
    university: 'UFSC',
    area: 'Saúde',
    description:
      'Exoesqueleto leve e acessível para reabilitação de membros inferiores em pacientes pós-AVC e lesão medular.',
    descriptionLong: `O dispositivo utiliza motores de alto torque e baixo peso combinados com sensores de eletromiografia para detectar intenção de movimento.

O custo de produção é 80% menor que alternativas importadas, tornando a tecnologia acessível para hospitais públicos e clínicas de fisioterapia.

Ensaio clínico em andamento com 60 pacientes no Hospital Universitário da UFSC.`,
    totalSupply: 100000,
    availableTokens: 85000,
    currentPrice: 4.2,
    initialPrice: 4.0,
    change24h: 1.8,
    volume: 45000,
    team: [
      { name: 'Prof. Dr. André Martins', role: 'Coordenador' },
      { name: 'Dra. Carla Souza', role: 'Fisioterapia' },
      { name: 'Eng. Roberto Lima', role: 'Mecatrônica' },
    ],
    tokenomics: { founders: 25, community: 45, liquidity: 20, reserve: 10 },
    status: 'pending',
    founderId: 'user_founder',
    founderName: 'Carlos Fundador',
    submittedAt: '2026-05-01T10:00:00Z',
    updates: [],
    curationHistory: [],
  },
  {
    ticker: 'PROJ:AQUA26',
    name: 'Sistema de Aquicultura Sustentável',
    university: 'UNESP',
    area: 'Sustentabilidade',
    description:
      'Sistema integrado de aquaponia para produção de peixes e hortaliças com zero desperdício de água.',
    descriptionLong: `Combina criação de tilápias com cultivo hidropônico de alface, tomate e ervas. A água do tanque de peixes fertiliza as plantas, que filtram a água de volta.

O sistema é modular e pode ser instalado em áreas urbanas, telhados e terrenos subutilizados. Cada módulo produz 200kg de peixe e 500kg de vegetais por ano.

Projeto piloto em funcionamento há 2 anos em escola técnica de Jaboticabal.`,
    totalSupply: 80000,
    availableTokens: 75000,
    currentPrice: 3.0,
    initialPrice: 3.0,
    change24h: 0,
    volume: 15000,
    team: [
      { name: 'Prof. Dr. Paulo Ribeiro', role: 'Coordenador' },
      { name: 'Dra. Mariana Costa', role: 'Engenharia de Alimentos' },
      { name: 'MSc. Diego Almeida', role: 'Automação' },
    ],
    tokenomics: { founders: 20, community: 55, liquidity: 15, reserve: 10 },
    status: 'pending',
    founderId: 'user_admin',
    founderName: 'Bernardo Admin',
    submittedAt: '2026-05-03T14:00:00Z',
    updates: [],
    curationHistory: [],
  },
  {
    ticker: 'PROJ:LING26',
    name: 'IA para Preservação de Línguas Indígenas',
    university: 'UnB',
    area: 'Humanas',
    description:
      'Plataforma de documentação e ensino de línguas indígenas brasileiras em risco de extinção usando modelos de linguagem.',
    descriptionLong: `O projeto trabalha em parceria com comunidades indígenas para criar dicionários digitais, gravações de falantes nativos e ferramentas de aprendizado interativo.

Já documentamos 8 línguas do tronco Tupi e 3 do tronco Macro-Jê. A plataforma é usada em escolas indígenas para revitalização linguística.

Reconhecido pelo IPHAN como projeto de salvaguarda do patrimônio imaterial brasileiro.`,
    totalSupply: 60000,
    availableTokens: 55000,
    currentPrice: 2.5,
    initialPrice: 2.5,
    change24h: 0,
    volume: 8000,
    team: [
      { name: 'Profa. Dra. Lucia Fernandes', role: 'Coordenadora' },
      { name: 'Dr. Marcos Kayapó', role: 'Linguística Indígena' },
      { name: 'MSc. Julia Santos', role: 'Processamento de Linguagem Natural' },
    ],
    tokenomics: { founders: 10, community: 65, liquidity: 15, reserve: 10 },
    status: 'pending',
    founderId: 'user_founder',
    founderName: 'Carlos Fundador',
    submittedAt: '2026-05-05T09:00:00Z',
    updates: [],
    curationHistory: [],
  },
  {
    ticker: 'PROJ:FERM26',
    name: 'Biorreator de Fermentação Contínua',
    university: 'UFRGS',
    area: 'Ciências',
    description:
      'Biorreator de alta eficiência para produção contínua de biocombustíveis de segunda geração a partir de bagaço de cana-de-açúcar.',
    descriptionLong: `O sistema integra enzimas imobilizadas e micro-organismos modificados geneticamente para converter celulose em etanol com rendimento 40% superior às tecnologias atuais.

O processo contínuo elimina tempos de parada para limpeza e reabastecimento, aumentando a produtividade anual em 3x comparado a sistemas batch.

Parceria com usina em São Paulo para teste piloto em 2026.`,
    totalSupply: 90000,
    availableTokens: 85000,
    currentPrice: 4.5,
    initialPrice: 4.5,
    change24h: 0,
    volume: 0,
    team: [
      { name: 'Prof. Dr. Guilherme Azevedo', role: 'Coordenador' },
      { name: 'Dra. Patrícia Gomes', role: 'Biotecnologia' },
      { name: 'MSc. Rafael Pires', role: 'Engenharia de Bioprocessos' },
    ],
    tokenomics: { founders: 62, community: 20, liquidity: 10, reserve: 8 },
    status: 'rejected',
    founderId: 'user_founder',
    founderName: 'Carlos Fundador',
    submittedAt: '2026-04-10T10:00:00Z',
    updates: [],
    curationHistory: [
      {
        id: 'cur_rej_1',
        action: 'rejected',
        curatorId: 'user_curator',
        curatorName: 'Ana Curadora',
        reason: 'Distribuição de founders acima de 60% desencoraja investidores. Tokenomics precisam ser rebalanceados com maior alocação para comunidade. Além disso, a descrição completa não especifica o modelo de retorno para os investidores. Recomenda-se revisar e resubmeter.',
        createdAt: '2026-04-14T16:00:00Z',
      },
    ],
  },
  {
    ticker: 'PROJ:NANO26',
    name: 'Nanopartículas para Tratamento de Câncer',
    university: 'UFPE',
    area: 'Saúde',
    description:
      'Nanopartículas magnéticas para entrega direcionada de quimioterápicos, reduzindo efeitos colaterais em 70%.',
    descriptionLong: `As nanopartículas são revestidas com anticorpos que reconhecem células tumorais, liberando o fármaco apenas no local do tumor.

Um campo magnético externo guia as partículas para o tumor, aumentando a concentração local do medicamento em até 50 vezes.

Testes pré-clínicos em modelos animais demonstraram redução de 85% no crescimento tumoral com dose 10x menor.`,
    totalSupply: 120000,
    availableTokens: 110000,
    currentPrice: 6.0,
    initialPrice: 6.0,
    change24h: 0,
    volume: 20000,
    team: [
      { name: 'Profa. Dra. Cristina Ramos', role: 'Coordenadora' },
      { name: 'Dr. Eduardo Neves', role: 'Oncologia' },
      { name: 'Dra. Amanda Vasconcelos', role: 'Nanotecnologia' },
    ],
    tokenomics: { founders: 15, community: 55, liquidity: 20, reserve: 10 },
    status: 'approved',
    founderId: 'user_admin',
    founderName: 'Bernardo Admin',
    submittedAt: '2024-07-01T10:00:00Z',
    approvedAt: '2024-07-10T14:00:00Z',
    updates: [],
    curationHistory: [],
  },
];

export const MOCK_PRICE_HISTORIES: Record<string, PricePoint[]> = {
  'PROJ:HIDRO24': generatePriceHistory(1001, 4.85),
  'PROJ:ROBO25':  generatePriceHistory(2002, 6.2),
  'PROJ:BIOM24':  generatePriceHistory(3003, 3.4),
  'PROJ:SOLA25':  generatePriceHistory(4004, 7.5),
  'PROJ:NEURO24': generatePriceHistory(5005, 8.4),
  'PROJ:AGRO25':  generatePriceHistory(6006, 5.1),
  'PROJ:CULT24':  generatePriceHistory(7007, 2.8),
  'PROJ:QUIM25':  generatePriceHistory(8008, 9.2),
  'PROJ:NANO26':  generatePriceHistory(9009, 6.0),
  'PROJ:REAB26':  generatePriceHistory(1010, 4.2),
  'PROJ:AQUA26':  generatePriceHistory(1111, 3.0),
  'PROJ:LING26':  generatePriceHistory(1212, 2.5),
};

export const MOCK_PORTFOLIO_HISTORY: PortfolioPoint[] = generatePortfolioHistory();

export function getSparklineForTicker(ticker: string): number[] {
  const h = MOCK_PRICE_HISTORIES[ticker];
  if (!h?.length) return [];
  return h.slice(-30).map(p => p.price);
}

export const MOCK_WALLET: WalletData = {
  availableBalance: 1235.5,
  totalInvested: 5965.0,
  totalValue: 7200.5,
  assets: [
    {
      ticker: 'PROJ:HIDRO24',
      projectName: 'Sistema de Monitoramento Hídrico Inteligente',
      tokensOwned: 500,
      averagePrice: 3.5,
      currentValue: 2425.0,
      change24h: 2.3,
      pnl: 675.0,
      pnlPercent: 38.57,
      priceHistory: MOCK_PRICE_HISTORIES['PROJ:HIDRO24'].slice(-7).map((p) => p.price),
    },
    {
      ticker: 'PROJ:ROBO25',
      projectName: 'Plataforma de Robótica Educacional Autônoma',
      tokensOwned: 300,
      averagePrice: 5.0,
      currentValue: 1860.0,
      change24h: -1.1,
      pnl: 360.0,
      pnlPercent: 24.0,
      priceHistory: MOCK_PRICE_HISTORIES['PROJ:ROBO25'].slice(-7).map((p) => p.price),
    },
    {
      ticker: 'PROJ:NEURO24',
      projectName: 'Análise Preditiva de Doenças Neurodegenerativas',
      tokensOwned: 200,
      averagePrice: 7.0,
      currentValue: 1680.0,
      change24h: -2.1,
      pnl: 280.0,
      pnlPercent: 20.0,
      priceHistory: MOCK_PRICE_HISTORIES['PROJ:NEURO24'].slice(-7).map((p) => p.price),
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
    status: 'confirmed',
  },
  {
    hash: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
    type: 'deposit',
    amount: 2000,
    value: 2000.0,
    timestamp: '2026-04-18T09:15:00Z',
    status: 'confirmed',
  },
  {
    hash: '0xb2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
    type: 'buy',
    ticker: 'PROJ:ROBO25',
    projectName: 'Plataforma de Robótica Educacional Autônoma',
    amount: 150,
    value: 930.0,
    timestamp: '2026-04-15T16:48:33Z',
    status: 'confirmed',
  },
  {
    hash: '0xc3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5',
    type: 'buy',
    ticker: 'PROJ:HIDRO24',
    projectName: 'Sistema de Monitoramento Hídrico Inteligente',
    amount: 300,
    value: 1455.0,
    timestamp: '2026-04-10T11:22:05Z',
    status: 'confirmed',
  },
  {
    hash: '0xd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
    type: 'deposit',
    amount: 3000,
    value: 3000.0,
    timestamp: '2026-04-08T08:00:00Z',
    status: 'confirmed',
  },
  {
    hash: '0xe5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7',
    type: 'buy',
    ticker: 'PROJ:ROBO25',
    projectName: 'Plataforma de Robótica Educacional Autônoma',
    amount: 150,
    value: 894.0,
    timestamp: '2026-04-05T13:10:22Z',
    status: 'confirmed',
  },
  {
    hash: '0xf6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8',
    type: 'buy',
    ticker: 'PROJ:HIDRO24',
    projectName: 'Sistema de Monitoramento Hídrico Inteligente',
    amount: 200,
    value: 920.0,
    timestamp: '2026-03-28T10:44:17Z',
    status: 'confirmed',
  },
  {
    hash: '0xa7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9',
    type: 'deposit',
    amount: 2500,
    value: 2500.0,
    timestamp: '2026-03-20T09:00:00Z',
    status: 'confirmed',
  },
  {
    hash: '0xb8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0',
    type: 'sell',
    ticker: 'PROJ:QUIM25',
    projectName: 'Catalisadores Verdes para Síntese Orgânica',
    amount: 50,
    value: 460.0,
    timestamp: '2026-03-15T14:20:00Z',
    status: 'confirmed',
  },
  {
    hash: '0xc9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1',
    type: 'withdraw',
    amount: 500,
    value: 500.0,
    timestamp: '2026-03-10T11:00:00Z',
    status: 'confirmed',
  },
];

export const MOCK_UNIVERSITIES = [
  'USP',
  'USP São Carlos',
  'UNICAMP',
  'UNESP',
  'UNIFESP',
  'UFRJ',
  'UFMG',
  'UFSC',
  'UFPE',
  'UnB',
  'ITA',
  'ESALQ/USP',
];

export const MOCK_AREAS: Area[] = [
  'Todas',
  'Tecnologia',
  'Saúde',
  'Engenharia',
  'Humanas',
  'Ciências',
  'Sustentabilidade',
];
