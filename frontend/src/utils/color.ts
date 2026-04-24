const PALETTE = [
  '#7C3AED', '#2563EB', '#059669', '#D97706',
  '#DC2626', '#0891B2', '#DB2777', '#65A30D',
];

export function getTickerColor(ticker: string): string {
  const sum = ticker.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return PALETTE[sum % PALETTE.length];
}

export function getTickerInitials(ticker: string): string {
  return ticker.replace('PROJ:', '').slice(0, 2);
}
