const morning = [
  'O índice DSC abriu em alta de 0.9%. PROJ:HIDRO24 lidera o volume matinal com 1.2K transações.',
  'Boa abertura: três projetos novos entraram em processo de curadoria na madrugada.',
  'O mercado amanheceu positivo. PROJ:GENO24 registrou maior valorização nas últimas 12h.',
];

const afternoon = [
  'O índice DSC fechou a manhã em alta de 1.8%. Três projetos novos entraram em curadoria e PROJ:HIDRO24 lidera o volume da semana.',
  'Volume da tarde 32% acima da média. PROJ:NEURO25 subiu 6.4% desde a abertura.',
  'Mercado em alta com liquidez elevada. PROJ:ROBO25 atingiu novo pico histórico de preço hoje.',
];

const evening = [
  'Pregão encerrando com volume acima do esperado. PROJ:SOLAR24 reverteu queda após relatório positivo.',
  'Alta de 1.2% no índice DSC no fechamento. Carteiras institucionais aumentaram posição em energia.',
  'Encerramento positivo da sessão. Destaque para PROJ:VERDE25 que captou R$ 42K nas últimas 3h.',
];

export function getMarketBriefing(): string {
  const h = new Date().getHours();
  const day = new Date().getDate();
  const pool = h < 12 ? morning : h < 18 ? afternoon : evening;
  return pool[day % pool.length];
}

export function getFormattedDateTime(): string {
  return new Date().toLocaleString('pt-BR', {
    weekday: 'short', day: '2-digit', month: 'short',
    year: 'numeric', hour: '2-digit', minute: '2-digit',
  }).replace(', ', ' ') + ' BRT';
}

export function getGreeting(): string {
  const h = new Date().getHours();
  return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
}
