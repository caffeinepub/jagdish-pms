export function formatINR(paise: bigint): string {
  const amount = Number(paise) / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatINRNumber(paise: bigint): string {
  const amount = Number(paise) / 100;
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNav(paise: bigint): string {
  const amount = Number(paise) / 100;
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatUnits(units: bigint): string {
  return (Number(units) / 1000).toFixed(3);
}

export function formatDate(nanos: bigint): string {
  const ms = Number(nanos) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function calcGainPercent(invested: bigint, current: bigint): number {
  if (invested === 0n) return 0;
  return ((Number(current) - Number(invested)) / Number(invested)) * 100;
}

export function categoryLabel(cat: string): string {
  const map: Record<string, string> = {
    equity: "Equity",
    debt: "Debt",
    hybrid: "Hybrid",
    elss: "ELSS",
  };
  return map[cat] ?? cat;
}

export function transactionLabel(t: string): string {
  const map: Record<string, string> = {
    buy: "Buy",
    sell: "Sell",
    sip: "SIP",
  };
  return map[t] ?? t;
}
