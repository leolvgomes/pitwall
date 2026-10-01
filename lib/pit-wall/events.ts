import type { TelemetryEvent, TelemetrySnapshot } from "./types";

function crossedUp(previous: number, next: number, threshold: number) {
  return previous < threshold && next >= threshold;
}

function createEvent(
  snapshot: TelemetrySnapshot,
  label: string,
  detail: string,
  tone: TelemetryEvent["tone"],
) {
  return {
    id: `${snapshot.session.tick}-${label.toLowerCase().replaceAll(" ", "-")}`,
    lap: snapshot.session.lap,
    timestamp: snapshot.session.timestamp,
    label,
    detail,
    tone,
  };
}

export function createInitialEvents(snapshot: TelemetrySnapshot): TelemetryEvent[] {
  return [
    createEvent(
      snapshot,
      "Simulation armed",
      "Telemetry stream initialized from local race model.",
      "info",
    ),
    createEvent(
      snapshot,
      "Baseline strategy",
      "Hold position, manage delta, protect tire phase.",
      "watch",
    ),
  ];
}

export function getEventsForTransition(
  previousSnapshot: TelemetrySnapshot,
  nextSnapshot: TelemetrySnapshot,
): TelemetryEvent[] {
  const events: TelemetryEvent[] = [];

  if (nextSnapshot.session.lap > previousSnapshot.session.lap) {
    events.push(
      createEvent(
        nextSnapshot,
        "Lap completed",
        `${nextSnapshot.pace.lastLap} logged, fuel ${nextSnapshot.fuel.remainingKg.toFixed(1)}kg.`,
        "info",
      ),
    );
  }

  if (nextSnapshot.session.position !== previousSnapshot.session.position) {
    const gained = nextSnapshot.session.position < previousSnapshot.session.position;
    events.push(
      createEvent(
        nextSnapshot,
        gained ? "Position gained" : "Position lost",
        `Car moved from P${previousSnapshot.session.position} to P${nextSnapshot.session.position}.`,
        gained ? "good" : "watch",
      ),
    );
  }

  if (crossedUp(previousSnapshot.temperatures.brakesC, nextSnapshot.temperatures.brakesC, 720)) {
    events.push(
      createEvent(
        nextSnapshot,
        "Brake watch",
        `Front axle peaked at ${nextSnapshot.temperatures.brakesC}C.`,
        "watch",
      ),
    );
  }

  if (crossedUp(previousSnapshot.tires.wearPercent, nextSnapshot.tires.wearPercent, 55)) {
    events.push(
      createEvent(
        nextSnapshot,
        "Tire degradation",
        `Medium set reached ${nextSnapshot.tires.wearPercent}% wear.`,
        "watch",
      ),
    );
  }

  if (crossedUp(previousSnapshot.tires.wearPercent, nextSnapshot.tires.wearPercent, 72)) {
    events.push(
      createEvent(
        nextSnapshot,
        "Tire critical",
        "Box readiness recommended on this stint.",
        "critical",
      ),
    );
  }

  if (previousSnapshot.session.lap < 20 && nextSnapshot.session.lap >= 20) {
    events.push(
      createEvent(
        nextSnapshot,
        "Pit window open",
        "Undercut model is now active for Plan A.",
        "good",
      ),
    );
  }

  if (previousSnapshot.fuel.targetDeltaKg <= 0 && nextSnapshot.fuel.targetDeltaKg > 0) {
    events.push(
      createEvent(
        nextSnapshot,
        "Fuel target cleared",
        `${nextSnapshot.fuel.targetDeltaKg.toFixed(1)}kg above model.`,
        "good",
      ),
    );
  }

  return events;
}
