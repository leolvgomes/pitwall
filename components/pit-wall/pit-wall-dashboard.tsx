"use client";

import { useEffect, useMemo, useState } from "react";
import { advanceSnapshot, createInitialSnapshot } from "@/lib/pit-wall/simulator";
import { getTelemetryMetrics, getTireSegments } from "@/lib/pit-wall/selectors";
import type { TelemetrySnapshot } from "@/lib/pit-wall/types";
import { CockpitHeader } from "./cockpit-header";
import { DriverStatus } from "./driver-status";
import { GapBoard } from "./gap-board";
import { SessionTimeline } from "./session-timeline";
import { TelemetryGrid } from "./telemetry-grid";
import { TireStrip } from "./tire-strip";

export function PitWallDashboard({
  initialSnapshot,
}: {
  initialSnapshot: TelemetrySnapshot;
}) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const interval = window.setInterval(() => {
      setSnapshot((currentSnapshot) => advanceSnapshot(currentSnapshot));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isPaused]);

  const displaySnapshot = useMemo<TelemetrySnapshot>(
    () => ({
      ...snapshot,
      session: {
        ...snapshot.session,
        status: isPaused ? "paused" : "simulated",
      },
    }),
    [isPaused, snapshot],
  );

  const metrics = getTelemetryMetrics(displaySnapshot);
  const tireSegments = getTireSegments(displaySnapshot);

  function resetSimulation() {
    setSnapshot(createInitialSnapshot());
    setIsPaused(false);
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
      <CockpitHeader
        snapshot={displaySnapshot}
        isPaused={isPaused}
        onReset={resetSimulation}
        onTogglePause={() => setIsPaused((currentValue) => !currentValue)}
      />

      <section className="grid flex-1 grid-cols-1 gap-3 xl:grid-cols-[320px_minmax(0,1fr)_360px]">
        <aside className="flex min-h-0 flex-col gap-3">
          <DriverStatus snapshot={displaySnapshot} />
          <TireStrip snapshot={displaySnapshot} segments={tireSegments} />
        </aside>

        <TelemetryGrid metrics={metrics} />

        <aside className="flex min-h-0 flex-col gap-3">
          <GapBoard snapshot={displaySnapshot} />
          <SessionTimeline snapshot={displaySnapshot} />
        </aside>
      </section>
    </div>
  );
}
