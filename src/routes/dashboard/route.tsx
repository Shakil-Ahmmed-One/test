import { SidebarInset } from "@/components/ui/sidebar";
import { getUserServer } from "@/features/auth/actions/server";
import DashboardHeader from "@/features/dashboard/components/DashboardHeader";
import DashboardSidebar from "@/features/dashboard/components/DashboardSidebar";
import DashboardProviders from "@/features/dashboard/providers";
import { generateMetadata } from "@/lib/tanstack-meta/generator";
import { protectedMiddleware } from "@/middleware/authMiddleware";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  head: () => generateMetadata({ title: "Dashboard" }),
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData({
      queryKey: ["user"],
      queryFn: getUserServer,
    });
  },
  component: RouteComponent,
  server: {
    middleware: [protectedMiddleware],
  },
});

function RouteComponent() {
  return (
    <DashboardProviders>
      <DashboardSidebar variant="inset" />
      <SidebarInset>
        <DashboardHeader />
        <main className="p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </DashboardProviders>
  );
}
