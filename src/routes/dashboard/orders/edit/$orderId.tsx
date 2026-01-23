import { Spinner } from "@/components/ui/spinner";
import EditOrderForm from "@/features/orders/components/EditOrderForm";
import { generateMetadata } from "@/lib/tanstack-meta/generator";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/dashboard/orders/edit/$orderId")({
  head: () => generateMetadata({ title: "Edit Order" }),
  component: RouteComponent,
  params: {
    parse: ({ orderId }) => ({ orderId: Number(orderId) }),
  },
});

function RouteComponent() {
  const { orderId }: { orderId: number } = Route.useParams();
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Order</h1>
      <Suspense fallback={<Spinner />}>
        <EditOrderForm orderId={orderId} />
      </Suspense>
    </section>
  );
}
