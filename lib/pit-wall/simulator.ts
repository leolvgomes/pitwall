import { simulatedSnapshot } from "./constants";
import { formatClock, formatGap, formatLapTime } from "./format";
import type { TelemetrySnapshot } from "./types";

const baseClockSeconds = 14 * 3600 + 27 * 60 + 8;
const ticksPerLap = 6;

function wave(tick: number, amplitude: number, period: number, phase = 0) {
  return Math.sin((tick + phase) / period) * amplitude;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function round(value: number, decimals = 1) {
  const multiplier = 10 ** decimals;
  return Math.round(value * multiplier) / multiplier;
}

export function createInitialSnapshot(): TelemetrySnapshot {
  return structuredClone(simulatedSnapshot);
}

export function advanceSnapshot(snapshot: TelemetrySnapshot): TelemetrySnapshot {
  if (snapshot.session.lap >= snapshot.session.totalLaps) {
    return snapshot;
  }

  const tick = snapshot.session.tick + 1;
  const completedSimLaps = Math.floor(tick / ticksPerLap);
  const lap = clamp(simulatedSnapshot.session.lap + completedSimLaps, 1, snapshot.session.totalLaps);
  const stintLap = simulatedSnapshot.session.stintLap + completedSimLaps;
  const lapTimeSeconds = 82.46 + wave(tick, 0.42, 5) + wave(tick, 0.18, 13, 4);
  const fuelRemaining = clamp(
    simulatedSnapshot.fuel.remainingKg - (tick * simulatedSnapshot.fuel.burnRateKgPerLap) / ticksPerLap,
    0,
    simulatedSnapshot.fuel.remainingKg,
  );
  const tireWear = clamp(simulatedSnapshot.tires.wearPercent + tick * 0.22 + wave(tick, 0.9, 9), 0, 100);
  const position = tick > 54 ? 2 : tick > 30 ? 4 : simulatedSnapshot.session.position;

  return {
    ...snapshot,
    session: {
      ...snapshot.session,
      lap,
      position,
      stintLap,
      tick,
      timestamp: formatClock(baseClockSeconds + tick),
      status: "simulated",
    },
    tires: {
      ...snapshot.tires,
      ageLaps: stintLap,
      pressurePsi: round(22.6 + wave(tick, 0.18, 8), 1),
      wearPercent: round(tireWear, 0),
    },
    fuel: {
      ...snapshot.fuel,
      remainingKg: round(fuelRemaining, 1),
      targetDeltaKg: round(-0.4 + wave(tick, 0.35, 11), 1),
    },
    temperatures: {
      engineC: round(102 + wave(tick, 3.2, 7), 0),
      brakesC: round(648 + wave(tick, 38, 4) + wave(tick, 18, 11, 2), 0),
      tiresC: round(94 + wave(tick, 5, 6), 0),
      trackC: round(41 + wave(tick, 1.2, 18), 0),
    },
    pace: {
      lastLap: formatLapTime(lapTimeSeconds),
      bestLap: lapTimeSeconds < 81.936 ? formatLapTime(lapTimeSeconds) : snapshot.pace.bestLap,
      sectorOne: (28.08 + wave(tick, 0.16, 5)).toFixed(3),
      sectorTwo: (31.43 + wave(tick, 0.2, 7, 2)).toFixed(3),
      sectorThree: (23.02 + wave(tick, 0.13, 6, 1)).toFixed(3),
    },
    gaps: {
      ...snapshot.gaps,
      ahead: formatGap(1.84 + wave(tick, 0.5, 8)),
      behind: formatGap(0.69 + wave(tick, 0.32, 6, 3)),
      leader: formatGap(6.1 + wave(tick, 1.1, 12)),
    },
  };
}
