import { Suspense } from "react";
import { DashboardClient } from "@/src/features/dashboard/components/dashboard-client";

export default function Home() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-screen-2xl p-8">
          <h1 className="text-3xl font-bold">Analytics Explorer</h1>
          <p role="status" className="mt-4">
            Preparing dashboard…
          </p>
        </main>
      }
    >
      <DashboardClient />
    </Suspense>
  );
}