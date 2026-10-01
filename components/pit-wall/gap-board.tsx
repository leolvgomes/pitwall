import type { TelemetrySnapshot } from "@/lib/pit-wall/types";

export function GapBoard({ snapshot }: { snapshot: TelemetrySnapshot }) {
  const rows = [
    { label: "Ahead", driver: snapshot.gaps.aheadDriver, gap: snapshot.gaps.ahead },
    { label: "Behind", driver: snapshot.gaps.behindDriver, gap: snapshot.gaps.behind },
    { label: "Leader", driver: "LEAD", gap: snapshot.gaps.leader },
  ];

  return (
    <section className="pit-panel rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Timing
          </p>
          <h2 className="mt-2 text-xl font-semibold text-white">Gap Board</h2>
        </div>
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--cyan)]">
          S2 Live
        </p>
      </div>

      <div className="mt-5 divide-y divide-[var(--line-soft)] border-y border-[var(--line-soft)]">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 py-4">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
              {row.label}
            </p>
            <p className="rounded border border-[var(--line)] bg-black/30 px-2 py-1 font-mono text-sm font-bold text-white">
              {row.driver}
            </p>
            <p className="min-w-20 text-right font-mono text-lg font-semibold text-white tabular">
              {row.gap}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
