import { formatFuel, formatPercent, formatSigned, formatTemperature } from "./format";
import type { MetricState, TelemetryMetric, TelemetrySnapshot, TireSegment } from "./types";

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
