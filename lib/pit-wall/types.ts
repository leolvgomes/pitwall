export type TireCompound = "soft" | "medium" | "hard" | "intermediate" | "wet";

export type DriverStatus = {
  id: string;
  name: string;
  code: string;
  team: string;
  carNumber: number;
};

export type MetricState = "nominal" | "watch" | "critical";

export type TelemetrySnapshot = {
  driver: DriverStatus;
  session: {
    name: string;
    lap: number;
    totalLaps: number;
    position: number;
    stintLap: number;
    tick: number;
    timestamp: string;
    status: "simulated" | "live" | "paused";
  };
  tires: {
    compound: TireCompound;
    ageLaps: number;
    wearPercent: number;
    pressurePsi: number;
  };
  fuel: {
    remainingKg: number;
    burnRateKgPerLap: number;
    targetDeltaKg: number;
  };
  temperatures: {
    engineC: number;
    brakesC: number;
    tiresC: number;
    trackC: number;
  };
  pace: {
    lastLap: string;
    bestLap: string;
    sectorOne: string;
    sectorTwo: string;
    sectorThree: string;
  };
  gaps: {
    ahead: string;
    aheadDriver: string;
    behind: string;
    behindDriver: string;
    leader: string;
  };
};

export type TelemetryMetric = {
  label: string;
  value: string;
  unit?: string;
  detail: string;
  state: MetricState;
  trend: "up" | "down" | "flat";
};

export type TireSegment = {
  label: string;
  temperatureC: number;
  wearPercent: number;
  state: MetricState;
};

export type TelemetryEventTone = "info" | "good" | "watch" | "critical";

export type TelemetryEvent = {
  id: string;
  lap: number;
  timestamp: string;
  label: string;
  detail: string;
  tone: TelemetryEventTone;
};

export type HistoryPoint = {
  tick: number;
  lap: number;
  fuelKg: number;
  tireWearPercent: number;
  brakeTempC: number;
  lapTimeSeconds: number;
};
