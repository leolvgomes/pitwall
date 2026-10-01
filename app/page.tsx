import { PitWallDashboard } from "@/components/pit-wall/pit-wall-dashboard";
import { createInitialSnapshot } from "@/lib/pit-wall/simulator";

export default function Home() {
  const initialSnapshot = createInitialSnapshot();

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <PitWallDashboard initialSnapshot={initialSnapshot} />
    </main>
  );
}
