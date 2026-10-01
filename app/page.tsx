import { CockpitHeader } from "@/components/pit-wall/cockpit-header";
import { DriverStatus } from "@/components/pit-wall/driver-status";
import { GapBoard } from "@/components/pit-wall/gap-board";
import { SessionTimeline } from "@/components/pit-wall/session-timeline";
import { TelemetryGrid } from "@/components/pit-wall/telemetry-grid";
import { TireStrip } from "@/components/pit-wall/tire-strip";
import { simulatedSnapshot } from "@/lib/pit-wall/constants";
import { getTelemetryMetrics, getTireSegments } from "@/lib/pit-wall/selectors";

export default function Home() {
  const metrics = getTelemetryMetrics(simulatedSnapshot);
  const tireSegments = getTireSegments(simulatedSnapshot);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <CockpitHeader snapshot={simulatedSnapshot} />

        <section className="grid flex-1 grid-cols-1 gap-3 xl:grid-cols-[320px_minmax(0,1fr)_360px]">
          <aside className="flex min-h-0 flex-col gap-3">
            <DriverStatus snapshot={simulatedSnapshot} />
            <TireStrip snapshot={simulatedSnapshot} segments={tireSegments} />
          </aside>

          <TelemetryGrid metrics={metrics} />

          <aside className="flex min-h-0 flex-col gap-3">
            <GapBoard snapshot={simulatedSnapshot} />
            <SessionTimeline snapshot={simulatedSnapshot} />
          </aside>
        </section>
      </div>
    </main>
  );
}
