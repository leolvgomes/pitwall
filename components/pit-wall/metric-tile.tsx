import type { MetricState, TelemetryMetric } from "@/lib/pit-wall/types";

const stateStyles: Record<MetricState, string> = {
  nominal: "border-[rgb(46_229_157_/_0.18)] text-[var(--green)]",
  watch: "border-[rgb(246_183_60_/_0.32)] text-[var(--amber)]",
  critical: "border-[rgb(240_68_56_/_0.4)] text-[var(--redline)]",
};

const trendLabel: Record<TelemetryMetric["trend"], string> = {
  up: "RISING",
  down: "FALLING",
  flat: "STABLE",
};

export function MetricTile({ metric }: { metric: TelemetryMetric }) {
  return (
    <article className="pit-panel min-h-[168px] rounded-lg p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            {metric.label}
          </p>
          <div className="mt-5 flex items-baseline gap-2 font-mono tabular">
            <span className="text-4xl font-semibold leading-none text-white md:text-5xl">
              {metric.value}
            </span>
            {metric.unit ? (
              <span className="text-sm font-semibold uppercase text-[var(--muted)]">
                {metric.unit}
              </span>
            ) : null}
          </div>
        </div>
        <span
          className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${stateStyles[metric.state]}`}
        >
          {metric.state}
        </span>
      </div>

      <div className="mt-6 flex items-end justify-between gap-3 border-t border-[var(--line-soft)] pt-3">
        <p className="text-sm text-slate-300">{metric.detail}</p>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
          {trendLabel[metric.trend]}
        </p>
      </div>
    </article>
  );
}
