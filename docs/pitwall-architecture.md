# Pit Wall Architecture

Pit Wall is a racing team mini dashboard built as a full-stack product, starting with simulated telemetry and a single engineering-console view. The first version should feel like race-control software: dense, precise, dark, legible, and calm under pressure.

## Product Shape

The initial dashboard shows live-ish simulated data for one team:

- Driver identity and car status
- Current lap and session progress
- Track position
- Tire compound and tire life
- Fuel level and burn rate
- Temperature readings
- Gaps to cars ahead and behind

The interface should optimize for scanning and comparison. It should avoid a marketing landing page, oversized hero sections, decorative cards, and explanatory copy inside the product surface.

## Technical Baseline

- Framework: Next.js App Router in `app/`
- React: Server Components by default, Client Components only for live simulation and interactive controls
- Styling: Tailwind CSS via `app/globals.css`, with CSS variables for product tokens
- TypeScript: strict mode with the existing `@/*` path alias
- Initial data source: deterministic local simulator, no external API

Next 16 docs in `node_modules/next/dist/docs/` confirm that folders under `app/` define routes, `page.tsx` exposes the route, `layout.tsx` wraps the app, and non-routable code can live outside routes or inside private folders. For this project, shared domain code should live outside `app/` so later API routes, tests, and UI components can share it without coupling to a route segment.

## Proposed File Structure

```txt
app/
  layout.tsx
  page.tsx
  globals.css

components/
  pit-wall/
    cockpit-header.tsx
    driver-status.tsx
    gap-board.tsx
    metric-tile.tsx
    session-timeline.tsx
    telemetry-grid.tsx
    tire-strip.tsx

lib/
  pit-wall/
    constants.ts
    simulator.ts
    types.ts
    format.ts
    selectors.ts

docs/
  pitwall-architecture.md
```

`app/page.tsx` should stay thin. It should render the dashboard shell and pass initial data into a client-side dashboard component when the simulator needs interval updates.

## Data Model

The simulator should produce a compact race snapshot:

```ts
type TireCompound = "soft" | "medium" | "hard" | "intermediate" | "wet";

type DriverStatus = {
  id: string;
  name: string;
  code: string;
  team: string;
  carNumber: number;
};

type TelemetrySnapshot = {
  driver: DriverStatus;
  session: {
    lap: number;
    totalLaps: number;
    position: number;
    timestamp: number;
  };
  tires: {
    compound: TireCompound;
    ageLaps: number;
    wearPercent: number;
  };
  fuel: {
    remainingKg: number;
    burnRateKgPerLap: number;
  };
  temperatures: {
    engineC: number;
    brakesC: number;
    tiresC: number;
    trackC: number;
  };
  gaps: {
    ahead: string;
    behind: string;
    leader: string;
  };
};
```

Keep the simulator deterministic enough for UI development. A seeded or bounded pseudo-random update loop is better than fully random values because the dashboard remains debuggable.

## Simulation Strategy

Start with a local client simulator:

1. `createInitialSnapshot()` returns the first state.
2. `advanceSnapshot(snapshot)` returns the next state.
3. A client component uses `setInterval` every 1000ms to advance the state.
4. Selectors derive display values, warnings, and trend states from the snapshot.

Later, this can become a full-stack exercise by moving the simulator behind:

- `app/api/telemetry/route.ts` for polling
- Server-Sent Events for streaming
- A small persistence layer for session history

The public UI should not care which transport supplies the snapshot. Components should receive typed data and display-ready states.

## UI Composition

The first screen should feel like a race engineer's workstation:

- Top command bar: session name, lap, clock, driver code, connection/simulation status
- Left column: driver card, position, tire/fuel summary
- Center: telemetry grid with core metrics and warning states
- Right column: gap board and stint strategy hints
- Bottom band: lap timeline or compact event feed

Use compact components with stable dimensions. Values can change without resizing cards, shifting rows, or moving labels. Numeric readouts should use tabular numerals.

## Visual Direction

Use a restrained engineering palette:

- Background: near-black graphite, not pure black
- Surfaces: layered charcoal and muted steel
- Accent: motorsport red or timing-screen green, used sparingly
- Warning: amber and red only for state changes that deserve attention
- Typography: sans for labels, mono for telemetry values

Motion should be rare and functional. Good candidates:

- Press feedback on controls
- Subtle value-change flash for telemetry deltas
- Warning state transition when a metric crosses a threshold

Avoid moving data the user is actively reading. Telemetry should feel stable.

## Component Boundaries

- `MetricTile` displays one value, unit, label, trend, and optional warning.
- `TelemetryGrid` arranges metrics and owns no simulation logic.
- `GapBoard` formats ahead/behind/leader gaps.
- `TireStrip` maps compound, wear, and age to a visual strip.
- `SessionTimeline` renders lap or event progression.
- `simulator.ts` owns state transitions.
- `selectors.ts` converts raw telemetry into UI states like `nominal`, `watch`, and `critical`.
- `format.ts` owns display formatting for gaps, kg, degrees, laps, and percentages.

## Implementation Phases

1. Replace the starter template with a static Pit Wall shell.
2. Add domain types, seed data, formatting helpers, and selector logic.
3. Add the client simulator and live ticking state.
4. Polish responsive behavior for laptop and desktop first, then mobile.
5. Add meaningful warnings and derived strategy hints.
6. Add an API route or stream when the UI contract is stable.

## Validation

For each implementation phase:

- Run `npm run lint`
- Run `npm run build`
- Visually inspect the dashboard in the browser
- Check that value changes do not cause layout shifts
- Check responsive layouts at desktop and mobile widths

## Installed Skills

The `emilkowalski/skills` package was installed into `.agents/skills` for this project. The relevant skills for this build are:

- `emil-design-eng` for UI polish and interaction judgment
- `prototype` if we decide to compare multiple dashboard directions before committing
- `animate` for small, purposeful motion once components exist
- `review-animations` or `improve-animations` after the UI has real interactions
