import type { TelemetrySnapshot } from "./types";

export const simulatedSnapshot: TelemetrySnapshot = {
  driver: {
    id: "car-44",
    name: "Leonardo Viana",
    code: "LVI",
    team: "Apex Dynamics",
    carNumber: 44,
  },
  session: {
    name: "Race Simulation",
    lap: 18,
    totalLaps: 44,
    position: 3,
    stintLap: 7,
    tick: 0,
    timestamp: "14:27:08",
    status: "simulated",
  },
  tires: {
    compound: "medium",
    ageLaps: 7,
    wearPercent: 38,
    pressurePsi: 22.6,
  },
  fuel: {
    remainingKg: 47.8,
    burnRateKgPerLap: 1.72,
    targetDeltaKg: -0.4,
  },
  temperatures: {
    engineC: 102,
    brakesC: 648,
    tiresC: 94,
    trackC: 41,
  },
  pace: {
    lastLap: "1:22.684",
    bestLap: "1:21.936",
    sectorOne: "28.114",
    sectorTwo: "31.487",
    sectorThree: "23.083",
  },
  gaps: {
    ahead: "+1.842",
    aheadDriver: "MSC",
    behind: "+0.694",
    behindDriver: "RUS",
    leader: "+6.103",
  },
};
