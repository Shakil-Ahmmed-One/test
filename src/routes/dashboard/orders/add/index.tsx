import { createFileRoute } from "@tanstack/react-router";
import CreateOrderForm from "@/features/orders/components/CreateOrderForm";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";

export const Route = createFileRoute("/dashboard/orders/add/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Add Order</h1>
      <Suspense fallback={<Spinner />}>
        <CreateOrderForm />
      </Suspense>
    </section>
  );
}
