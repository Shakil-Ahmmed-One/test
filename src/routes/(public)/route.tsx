import SiteHeader from "@/features/home/SiteHeader";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(public)")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="min-h-dvh space-y-12">
      <SiteHeader />
      <Outlet />
    </main>
  );
}
