import type { TelemetrySnapshot } from "@/lib/pit-wall/types";

const events = [
  { lap: 12, label: "Box window opened", tone: "text-[var(--green)]" },
  { lap: 16, label: "Brake bias +1.0", tone: "text-[var(--cyan)]" },
  { lap: 18, label: "Hold position, manage delta", tone: "text-[var(--amber)]" },
];

export function SessionTimeline({ snapshot }: { snapshot: TelemetrySnapshot }) {
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
        <div className="h-full rounded-full bg-[var(--redline)]" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-6 space-y-3">
        {events.map((event) => (
          <div
            key={event.label}
            className="grid grid-cols-[54px_1fr] gap-3 rounded-md border border-[var(--line-soft)] bg-black/20 p-3"
          >
            <p className="font-mono text-sm font-bold text-white tabular">L{event.lap}</p>
            <p className={`text-sm font-medium ${event.tone}`}>{event.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-md border border-[rgb(246_183_60_/_0.24)] bg-[rgb(246_183_60_/_0.06)] p-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--amber)]">
          Current call
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-200">
          Keep target lap within +0.4s and protect rear tire phase until lap 24.
        </p>
      </div>
    </section>
  );
}
