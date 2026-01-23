import { Spinner } from "@/components/ui/spinner";
import AllLandingPagesTable from "@/features/landing-pages/components/AllLandingPagesTable";
import { generateMetadata } from "@/lib/tanstack-meta/generator";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/dashboard/landing-pages/all/")({
  head: () => generateMetadata({ title: "All Landing Pages" }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-bold">All Landing Pages</h1>
      <Suspense fallback={<Spinner />}>
        <AllLandingPagesTable />
      </Suspense>
    </main>
  );
}
