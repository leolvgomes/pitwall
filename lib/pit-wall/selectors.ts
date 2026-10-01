import {
  formatFuel,
  formatPercent,
  formatSigned,
  formatTemperature,
  parseLapTime,
} from "./format";
import type {
  HistoryPoint,
  MetricState,
  TelemetryMetric,
  TelemetrySnapshot,
  TireSegment,
} from "./types";

function highValueState(value: number, watch: number, critical: number): MetricState {
  if (value >= critical) {
    return "critical";
  }

  if (value >= watch) {
    return "watch";
  }

  return "nominal";
}

function lowValueState(value: number, watch: number, critical: number): MetricState {
  if (value <= critical) {
    return "critical";
  }

  if (value <= watch) {
    return "watch";
  }

  return "nominal";
}

export function getTelemetryMetrics(snapshot: TelemetrySnapshot): TelemetryMetric[] {
  return [
    {
      label: "Position",
      value: `P${snapshot.session.position}`,
      detail: `Lap ${snapshot.session.lap}/${snapshot.session.totalLaps}`,
      state: "nominal",
      trend: "flat",
    },
    {
      label: "Fuel",
      value: formatFuel(snapshot.fuel.remainingKg),
      unit: "kg",
      detail: `${formatSigned(snapshot.fuel.targetDeltaKg)} kg vs target`,
      state: lowValueState(snapshot.fuel.remainingKg, 35, 24),
      trend: "down",
    },
    {
      label: "Engine",
      value: formatTemperature(snapshot.temperatures.engineC),
      unit: "C",
      detail: "Water temp stable",
      state: highValueState(snapshot.temperatures.engineC, 108, 116),
      trend: "up",
    },
    {
      label: "Brakes",
      value: formatTemperature(snapshot.temperatures.brakesC),
      unit: "C",
      detail: "Front axle peak",
      state: highValueState(snapshot.temperatures.brakesC, 720, 820),
      trend: "flat",
    },
    {
      label: "Tire Wear",
      value: formatPercent(snapshot.tires.wearPercent),
      detail: `${snapshot.tires.ageLaps} laps on ${snapshot.tires.compound.toUpperCase()}`,
      state: highValueState(snapshot.tires.wearPercent, 55, 72),
      trend: "up",
    },
    {
      label: "Last Lap",
      value: snapshot.pace.lastLap,
      detail: `${snapshot.pace.bestLap} session best`,
      state: "nominal",
      trend: "down",
    },
  ];
}

export function getTireSegments(snapshot: TelemetrySnapshot): TireSegment[] {
  const { tiresC } = snapshot.temperatures;
  const { wearPercent } = snapshot.tires;

  return [
    { label: "FL", temperatureC: tiresC + 4, wearPercent: wearPercent + 3, state: "watch" },
    { label: "FR", temperatureC: tiresC + 2, wearPercent: wearPercent + 1, state: "nominal" },
    { label: "RL", temperatureC: tiresC - 3, wearPercent: wearPercent - 2, state: "nominal" },
    { label: "RR", temperatureC: tiresC - 1, wearPercent, state: "nominal" },
  ];
}

export function getHistoryPoints(history: TelemetrySnapshot[]): HistoryPoint[] {
  return history.map((snapshot) => ({
    tick: snapshot.session.tick,
    lap: snapshot.session.lap,
    fuelKg: snapshot.fuel.remainingKg,
    tireWearPercent: snapshot.tires.wearPercent,
    brakeTempC: snapshot.temperatures.brakesC,
    lapTimeSeconds: parseLapTime(snapshot.pace.lastLap),
  }));
}

export function getStrategyCall(snapshot: TelemetrySnapshot) {
  if (snapshot.temperatures.brakesC >= 720) {
    return "Open brake migration and lift 20m into T1 until front temps settle.";
  }

  if (snapshot.tires.wearPercent >= 55) {
    return "Protect rear phase and prepare Plan B if degradation keeps rising.";
  }

  if (snapshot.fuel.targetDeltaKg > 0.1) {
    return "Fuel target positive. Release pace and attack the car ahead.";
  }

  if (snapshot.session.lap >= 20 && snapshot.session.lap <= 24) {
    return "Pit window active. Hold delta and keep undercut gap inside 2.2s.";
  }

  return "Keep target lap within +0.4s and protect rear tire phase until lap 24.";
}
