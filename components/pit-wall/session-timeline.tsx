import type {
  HistoryPoint,
  StrategyModel,
  StrategyTone,
  TelemetryEvent,
  TelemetrySnapshot,
} from "@/lib/pit-wall/types";

const eventToneStyles: Record<TelemetryEvent["tone"], string> = {
  info: "text-[var(--cyan)]",
  good: "text-[var(--green)]",
  watch: "text-[var(--amber)]",
  critical: "text-[var(--redline)]",
};

const strategyToneStyles: Record<StrategyTone, string> = {
  good: "border-[rgb(46_229_157_/_0.28)] text-[var(--green)]",
  neutral: "border-[rgb(97_214_255_/_0.24)] text-[var(--cyan)]",
  watch: "border-[rgb(246_183_60_/_0.3)] text-[var(--amber)]",
  critical: "border-[rgb(240_68_56_/_0.4)] text-[var(--redline)]",
};

export function SessionTimeline({
  events,
  history,
  snapshot,
  strategyCall,
  strategyModel,
}: {
  events: TelemetryEvent[];
  history: HistoryPoint[];
  snapshot: TelemetrySnapshot;
  strategyCall: string;
  strategyModel: StrategyModel;
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
      <StrategyPanel model={strategyModel} strategyCall={strategyCall} />
      <SparklineGrid history={history} />

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

    </section>
  );
}

function StrategyPanel({
  model,
  strategyCall,
}: {
  model: StrategyModel;
  strategyCall: string;
}) {
  return (
    <div className="mt-3 rounded-md border border-[var(--line-soft)] bg-black/20 p-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
            Strategy Model
          </p>
          <p className="mt-1 text-xs text-slate-400">Projected to chequered flag</p>
        </div>
        <span
          className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${strategyToneStyles[model.tone]}`}
        >
          {model.tone}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <StrategyReadout label="Laps left" value={String(model.lapsRemaining)} />
        <StrategyReadout
          label="Finish fuel"
          value={`${model.projectedFinishFuelKg.toFixed(1)}kg`}
          danger={model.projectedFinishFuelKg < 0}
        />
        <StrategyReadout label="Tire life" value={`${model.tireLifeRemainingLaps}L`} />
        <StrategyReadout label="Pit window" value={model.pitWindow.toUpperCase()} />
        <StrategyReadout label="Undercut" value={`${model.undercutRisk}%`} />
        <StrategyReadout label="Overcut" value={`${model.overcutRisk}%`} />
      </div>

      <div className="mt-3 rounded-md border border-[rgb(246_183_60_/_0.24)] bg-[rgb(246_183_60_/_0.06)] p-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--amber)]">
          Current call
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-200">{strategyCall}</p>
      </div>
    </div>
  );
}

function StrategyReadout({
  danger = false,
  label,
  value,
}: {
  danger?: boolean;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-[var(--line-soft)] bg-black/20 p-2">
      <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
        {label}
      </p>
      <p
        className={`mt-1 font-mono text-sm font-semibold tabular ${danger ? "text-[var(--redline)]" : "text-white"}`}
      >
        {value}
      </p>
    </div>
  );
}

function SparklineGrid({ history }: { history: HistoryPoint[] }) {
  const visibleHistory = history.slice(-24);

  return (
    <div className="mt-3 grid grid-cols-2 gap-2">
      <SparklineCard
        color="var(--cyan)"
        label="Lap pace"
        points={visibleHistory.map((point) => point.lapTimeSeconds)}
        suffix="s"
      />
      <SparklineCard
        color="var(--green)"
        invert
        label="Fuel"
        points={visibleHistory.map((point) => point.fuelKg)}
        suffix="kg"
      />
      <SparklineCard
        color="var(--amber)"
        label="Tire wear"
        points={visibleHistory.map((point) => point.tireWearPercent)}
        suffix="%"
      />
      <SparklineCard
        color="var(--redline)"
        label="Brake temp"
        points={visibleHistory.map((point) => point.brakeTempC)}
        suffix="C"
      />
    </div>
  );
}

function SparklineCard({
  color,
  invert = false,
  label,
  points,
  suffix,
}: {
  color: string;
  invert?: boolean;
  label: string;
  points: number[];
  suffix: string;
}) {
  const latestValue = points.at(-1) ?? 0;
  const path = buildSparklinePath(points, invert);

  return (
    <div className="rounded-md border border-[var(--line-soft)] bg-black/20 p-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
          {label}
        </p>
        <p className="font-mono text-xs font-semibold text-white tabular">
          {latestValue.toFixed(label === "Brake temp" ? 0 : 1)}
          {suffix}
        </p>
      </div>
      <svg
        aria-hidden="true"
        className="mt-3 h-12 w-full overflow-visible"
        preserveAspectRatio="none"
        viewBox="0 0 100 40"
      >
        <path d="M0 39 H100" stroke="rgb(255 255 255 / 0.08)" strokeWidth="1" />
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.25"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

function buildSparklinePath(points: number[], invert: boolean) {
  if (points.length === 0) {
    return "M0 20 L100 20";
  }

  if (points.length === 1) {
    return "M0 20 L100 20";
  }

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = Math.max(max - min, 0.01);
  const coordinates = points.map((point, index) => {
    const x = (index / (points.length - 1)) * 100;
    const normalized = (point - min) / range;
    const y = invert ? 6 + normalized * 28 : 34 - normalized * 28;

    return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
  });

  return coordinates.join(" ");
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
