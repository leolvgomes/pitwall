import type { TelemetrySnapshot } from "@/lib/pit-wall/types";

export function DriverStatus({ snapshot }: { snapshot: TelemetrySnapshot }) {
  return (
    <section className="pit-panel rounded-lg p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Driver
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            {snapshot.driver.name}
          </h2>
          <p className="mt-1 text-sm text-slate-400">{snapshot.driver.team}</p>
        </div>
        <div className="rounded-md border border-[var(--line)] bg-black/30 px-3 py-2 text-right">
          <p className="font-mono text-2xl font-bold text-white">{snapshot.driver.code}</p>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
            Car {snapshot.driver.carNumber}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2">
        <DriverReadout label="Position" value={`P${snapshot.session.position}`} />
        <DriverReadout label="Stint Lap" value={String(snapshot.session.stintLap)} />
        <DriverReadout label="Best" value={snapshot.pace.bestLap} />
        <DriverReadout label="Last" value={snapshot.pace.lastLap} />
      </div>
    </section>
  );
}

function DriverReadout({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[var(--line-soft)] bg-black/20 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-2 font-mono text-xl font-semibold text-white tabular">{value}</p>
    </div>
  );
}
