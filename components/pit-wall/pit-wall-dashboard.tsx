"use client";

import { useEffect, useMemo, useReducer, useState } from "react";
import { createInitialEvents, getEventsForTransition } from "@/lib/pit-wall/events";
import { advanceSnapshot, createInitialSnapshot } from "@/lib/pit-wall/simulator";
import {
  getHistoryPoints,
  getStrategyModel,
  getStrategyCall,
  getTelemetryMetrics,
  getTireSegments,
} from "@/lib/pit-wall/selectors";
import type { TelemetryEvent, TelemetrySnapshot } from "@/lib/pit-wall/types";
import { CockpitHeader } from "./cockpit-header";
import { DriverStatus } from "./driver-status";
import { GapBoard } from "./gap-board";
import { SessionTimeline } from "./session-timeline";
import { TelemetryGrid } from "./telemetry-grid";
import { TireStrip } from "./tire-strip";

type SimulationState = {
  events: TelemetryEvent[];
  history: TelemetrySnapshot[];
  snapshot: TelemetrySnapshot;
};

type SimulationAction =
  | { type: "reset"; snapshot: TelemetrySnapshot }
  | { type: "tick" };

function createSimulationState(snapshot: TelemetrySnapshot): SimulationState {
  return {
    events: createInitialEvents(snapshot),
    history: [snapshot],
    snapshot,
  };
}

function simulationReducer(
  state: SimulationState,
  action: SimulationAction,
): SimulationState {
  if (action.type === "reset") {
    return createSimulationState(action.snapshot);
  }

  const nextSnapshot = advanceSnapshot(state.snapshot);
  const transitionEvents = getEventsForTransition(state.snapshot, nextSnapshot);

  return {
    snapshot: nextSnapshot,
    history: [...state.history, nextSnapshot].slice(-36),
    events:
      transitionEvents.length > 0
        ? [...transitionEvents, ...state.events].slice(0, 8)
        : state.events,
  };
}

export function PitWallDashboard({
  initialSnapshot,
}: {
  initialSnapshot: TelemetrySnapshot;
}) {
  const [simulationState, dispatchSimulation] = useReducer(
    simulationReducer,
    initialSnapshot,
    createSimulationState,
  );
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const interval = window.setInterval(() => {
      dispatchSimulation({ type: "tick" });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isPaused]);

  const displaySnapshot = useMemo<TelemetrySnapshot>(
    () => ({
      ...simulationState.snapshot,
      session: {
        ...simulationState.snapshot.session,
        status: isPaused ? "paused" : "simulated",
      },
    }),
    [isPaused, simulationState.snapshot],
  );

  const metrics = getTelemetryMetrics(displaySnapshot);
  const tireSegments = getTireSegments(displaySnapshot);
  const historyPoints = getHistoryPoints(simulationState.history);
  const strategyModel = getStrategyModel(displaySnapshot, historyPoints);
  const strategyCall = getStrategyCall(displaySnapshot);

  function resetSimulation() {
    const nextInitialSnapshot = createInitialSnapshot();

    dispatchSimulation({ type: "reset", snapshot: nextInitialSnapshot });
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
          <SessionTimeline
            events={simulationState.events}
            history={historyPoints}
            snapshot={displaySnapshot}
            strategyCall={strategyCall}
            strategyModel={strategyModel}
          />
        </aside>
      </section>
    </div>
  );
}
