import { Spinner } from "@/components/ui/spinner";
import EditProductForm from "@/features/products/components/EditProductForm";
import { generateMetadata } from "@/lib/tanstack-meta/generator";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/dashboard/products/edit/$productId")({
  head: () => generateMetadata({ title: "Edit Product" }),
  component: RouteComponent,
});

function RouteComponent() {
  const { productId }: { productId: number } = Route.useParams();
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Product</h1>
      <Suspense fallback={<Spinner />}>
        <EditProductForm productId={productId} />
      </Suspense>
    </section>
  );
}
