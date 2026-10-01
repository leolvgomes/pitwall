import type { TelemetryMetric } from "@/lib/pit-wall/types";
import { MetricTile } from "./metric-tile";

export function TelemetryGrid({ metrics }: { metrics: TelemetryMetric[] }) {
  return (
    <section className="pit-grid min-h-[560px] rounded-lg border border-[var(--line-soft)] bg-[rgb(12_17_20_/_0.86)] p-3">
      <div className="mb-3 flex items-center justify-between border-b border-[var(--line-soft)] pb-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
            Telemetry Matrix
          </p>
          <h2 className="mt-1 text-xl font-semibold text-white">Car health and pace</h2>
        </div>
        <div className="hidden rounded-full border border-[rgb(46_229_157_/_0.24)] px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--green)] sm:block">
          Nominal Run
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
        {metrics.map((metric) => (
          <MetricTile key={metric.label} metric={metric} />
        ))}
      </div>
    </section>
  );
}
