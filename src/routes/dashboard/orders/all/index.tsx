import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import AllOrdersTable from "@/features/orders/components/AllOrdersTable";
import { generateMetadata } from "@/lib/tanstack-meta/generator";
import { IconPlus } from "@tabler/icons-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/dashboard/orders/all/")({
  head: () => generateMetadata({ title: "All Orders" }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="container space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">All Orders</h1>
        <Button asChild>
          <Link to="/dashboard/orders/add">
            <IconPlus />
            Add New Order
          </Link>
        </Button>
      </div>
      <Suspense fallback={<Spinner />}>
        <AllOrdersTable />
      </Suspense>
    </section>
  );
}
