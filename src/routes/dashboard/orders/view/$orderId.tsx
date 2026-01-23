import { Spinner } from "@/components/ui/spinner";
import OrderDetails from "@/features/orders/components/OrderDetails";
import { generateMetadata } from "@/lib/tanstack-meta/generator";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/dashboard/orders/view/$orderId")({
  head: () =>
    generateMetadata({
      title: "Order Details",
    }),
  component: RouteComponent,
});

function RouteComponent() {
  const { orderId }: { orderId: number } = Route.useParams();
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Order Details</h1>
      <Suspense fallback={<Spinner />}>
        <OrderDetails orderId={orderId} />
      </Suspense>
    </section>
  );
}
