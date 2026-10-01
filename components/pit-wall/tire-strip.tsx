import type { TelemetrySnapshot, TireSegment } from "@/lib/pit-wall/types";

const compoundStyles = {
  soft: "bg-[var(--redline)]",
  medium: "bg-[var(--amber)]",
  hard: "bg-white",
  intermediate: "bg-[var(--green)]",
  wet: "bg-[var(--cyan)]",
};

export function TireStrip({
  snapshot,
  segments,
}: {
  snapshot: TelemetrySnapshot;
  segments: TireSegment[];
}) {
  return (
    <section className="pit-panel rounded-lg p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Tire Set
          </p>
          <div className="mt-3 flex items-center gap-3">
            <span
              className={`size-4 rounded-full ${compoundStyles[snapshot.tires.compound]}`}
              aria-hidden="true"
            />
            <p className="text-2xl font-semibold uppercase text-white">
              {snapshot.tires.compound}
            </p>
          </div>
        </div>
        <div className="text-right font-mono tabular">
          <p className="text-2xl font-semibold text-white">{snapshot.tires.pressurePsi}</p>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
            PSI
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2">
        {segments.map((segment) => (
          <div
            key={segment.label}
            className="rounded-md border border-[var(--line-soft)] bg-black/20 p-3"
          >
            <div className="flex items-center justify-between">
              <p className="font-mono text-sm font-bold text-white">{segment.label}</p>
              <p className="font-mono text-xs text-[var(--muted)]">{segment.temperatureC}C</p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[var(--amber)]"
                style={{ width: `${segment.wearPercent}%` }}
              />
            </div>
            <p className="mt-2 font-mono text-xs text-slate-300">{segment.wearPercent}% wear</p>
          </div>
        ))}
      </div>
    </section>
  );
}
