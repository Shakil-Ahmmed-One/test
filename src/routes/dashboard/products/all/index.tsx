import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import AllProductsTable from "@/features/products/components/AllProductsTable";
import { generateMetadata } from "@/lib/tanstack-meta/generator";
import { IconPlus } from "@tabler/icons-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/dashboard/products/all/")({
  head: () => generateMetadata({ title: "All Products" }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="container space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">All Products</h1>
        <Button asChild>
          <Link to="/dashboard/products/add">
            <IconPlus />
            Add New Product
          </Link>
        </Button>
      </div>
      <Suspense fallback={<Spinner />}>
        <AllProductsTable />
      </Suspense>
    </section>
  );
}
