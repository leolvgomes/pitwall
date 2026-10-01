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

export function formatGap(value: number) {
  return `+${Math.max(0, value).toFixed(3)}`;
}

export function formatClock(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600) % 24;
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds].map((part) => String(part).padStart(2, "0")).join(":");
}

export function formatLapTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const milliseconds = Math.round((totalSeconds - Math.floor(totalSeconds)) * 1000);

  return `${minutes}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(3, "0")}`;
}

export function parseLapTime(lapTime: string) {
  const [minutes = "0", seconds = "0"] = lapTime.split(":");
  return Number(minutes) * 60 + Number(seconds);
}
