export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function formatTemperature(value: number) {
  return `${Math.round(value)}`;
}

export function formatFuel(value: number) {
  return value.toFixed(1);
}

export function formatSigned(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}`;
}
