import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import AllLandingPagesTable from "@/features/landing-pages/components/AllLandingPagesTable";
import { generateMetadata } from "@/lib/tanstack-meta/generator";
import { IconPlus } from "@tabler/icons-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/dashboard/landing-pages/all/")({
  head: () => generateMetadata({ title: "All Landing Pages" }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">All Landing Pages</h1>
        <Button asChild>
          <Link to="/dashboard/landing-pages/add">
            <IconPlus />
            Add New Landing Page
          </Link>
        </Button>
      </div>
      <Suspense fallback={<Spinner />}>
        <AllLandingPagesTable />
      </Suspense>
    </section>
  );
}
