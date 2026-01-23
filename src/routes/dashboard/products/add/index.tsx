import CreateProductForm from "@/features/products/components/CreateProductForm";
import { generateMetadata } from "@/lib/tanstack-meta/generator";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/products/add/")({
  head: () => generateMetadata({ title: "Add Product" }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Add Product</h1>
      <CreateProductForm />
    </section>
  );
}
