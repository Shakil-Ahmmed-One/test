import { Spinner } from "@/components/ui/spinner";
import CreateLandingPageForm from "@/features/landing-pages/components/CreateLandingPageForm";
import { generateMetadata } from "@/lib/tanstack-meta/generator";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/dashboard/landing-pages/add/")({
  head: () => generateMetadata({ title: "Add Landing Page" }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-bold">Add Landing Page</h1>
      <Suspense fallback={<Spinner />}>
        <CreateLandingPageForm />
      </Suspense>
    </main>
  );
}
