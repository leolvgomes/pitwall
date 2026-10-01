import type { HistoryPoint, TelemetryEvent, TelemetrySnapshot } from "@/lib/pit-wall/types";

const eventToneStyles: Record<TelemetryEvent["tone"], string> = {
  info: "text-[var(--cyan)]",
  good: "text-[var(--green)]",
  watch: "text-[var(--amber)]",
  critical: "text-[var(--redline)]",
};

export function SessionTimeline({
  events,
  history,
  snapshot,
  strategyCall,
}: {
  events: TelemetryEvent[];
  history: HistoryPoint[];
  snapshot: TelemetrySnapshot;
  strategyCall: string;
}) {
  const progress = (snapshot.session.lap / snapshot.session.totalLaps) * 100;

  return (
    <section className="pit-panel flex-1 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Strategy
          </p>
          <h2 className="mt-2 text-xl font-semibold text-white">Session Timeline</h2>
        </div>
        <p className="font-mono text-sm font-semibold text-white tabular">
          {Math.round(progress)}%
        </p>
      </div>

      <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className="session-progress-fill h-full rounded-full bg-[var(--redline)]"
          style={{ transform: `scaleX(${progress / 100})` }}
        />
      </div>

      <HistoryStrip history={history} />

      <div className="mt-6 space-y-2">
        {events.map((event, index) => (
          <div
            key={`${event.id}-${index}`}
            className="grid grid-cols-[54px_1fr] gap-3 rounded-md border border-[var(--line-soft)] bg-black/20 p-3"
          >
            <div>
              <p className="font-mono text-sm font-bold text-white tabular">L{event.lap}</p>
              <p className="mt-1 font-mono text-[10px] text-[var(--muted)]">{event.timestamp}</p>
            </div>
            <div>
              <p className={`text-sm font-semibold ${eventToneStyles[event.tone]}`}>
                {event.label}
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-400">{event.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-md border border-[rgb(246_183_60_/_0.24)] bg-[rgb(246_183_60_/_0.06)] p-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--amber)]">
          Current call
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-200">{strategyCall}</p>
      </div>
    </section>
  );
}

function HistoryStrip({ history }: { history: HistoryPoint[] }) {
  const visibleHistory = history.slice(-18);
  const maxBrakeTemp = Math.max(...visibleHistory.map((point) => point.brakeTempC), 1);
  const minFuel = Math.min(...visibleHistory.map((point) => point.fuelKg));
  const maxFuel = Math.max(...visibleHistory.map((point) => point.fuelKg));
  const fuelRange = Math.max(maxFuel - minFuel, 1);
  const lastPoint = visibleHistory.at(-1);

  return (
    <div className="mt-6 rounded-md border border-[var(--line-soft)] bg-black/20 p-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
            Snapshot History
          </p>
          <p className="mt-1 text-xs text-slate-400">Last {visibleHistory.length} samples</p>
        </div>
        {lastPoint ? (
          <p className="font-mono text-xs font-semibold text-white tabular">
            L{lastPoint.lap} / {lastPoint.fuelKg.toFixed(1)}kg
          </p>
        ) : null}
      </div>

      <div className="mt-4 grid h-24 grid-cols-[repeat(18,minmax(4px,1fr))] items-end gap-1">
        {visibleHistory.map((point, index) => {
          const fuelPressure = ((maxFuel - point.fuelKg) / fuelRange) * 42;
          const brakeLoad = (point.brakeTempC / maxBrakeTemp) * 82;

          return (
            <div
              key={`${point.tick}-${index}`}
              className="flex h-full flex-col justify-end gap-1"
              title={`Lap ${point.lap} / ${point.fuelKg.toFixed(1)}kg / ${point.brakeTempC}C`}
            >
              <span
                className="history-bar bg-[var(--redline)]"
                style={{ height: `${Math.max(brakeLoad, 10)}%` }}
              />
              <span
                className="history-bar bg-[var(--green)]"
                style={{ height: `${Math.max(fuelPressure, 6)}%` }}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
        <span>Brake temp</span>
        <span>Fuel burn</span>
      </div>
    </div>
  );
}
