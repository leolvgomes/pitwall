import type { TelemetrySnapshot } from "@/lib/pit-wall/types";

export function CockpitHeader({
  snapshot,
  isPaused,
  onReset,
  onTogglePause,
}: {
  snapshot: TelemetrySnapshot;
  isPaused?: boolean;
  onReset?: () => void;
  onTogglePause?: () => void;
}) {
  return (
    <header className="pit-panel rounded-lg px-4 py-3">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-md border border-[rgb(240_68_56_/_0.35)] bg-[rgb(240_68_56_/_0.08)] font-mono text-lg font-bold text-[var(--redline)]">
            {snapshot.driver.carNumber}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
              Pit Wall
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">
              {snapshot.session.name}
            </h1>
          </div>
        </div>

        <div className="flex flex-col gap-2 xl:flex-row xl:items-center">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <HeaderReadout label="Driver" value={snapshot.driver.code} />
            <HeaderReadout label="Lap" value={`${snapshot.session.lap}/${snapshot.session.totalLaps}`} />
            <HeaderReadout label="Clock" value={snapshot.session.timestamp} />
            <HeaderReadout label="Feed" value={snapshot.session.status.toUpperCase()} accent />
          </div>

          {onReset && onTogglePause ? (
            <div className="grid grid-cols-2 gap-2 xl:w-[188px]">
              <button className="control-button" type="button" onClick={onTogglePause}>
                {isPaused ? "Resume" : "Pause"}
              </button>
              <button className="control-button" type="button" onClick={onReset}>
                Reset
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function HeaderReadout({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="min-w-[132px] rounded-md border border-[var(--line-soft)] bg-black/20 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
        {label}
      </p>
      <p
        className={`mt-1 font-mono text-sm font-semibold tabular ${accent ? "text-[var(--green)]" : "text-white"}`}
      >
        {value}
      </p>
    </div>
  );
}
