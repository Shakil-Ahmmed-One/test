import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getProductsServer } from "../actions/server/getProductsServer";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { IconPackages, IconPencil, IconTrash } from "@tabler/icons-react";
import { Image } from "@unpic/react";
import { Link } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { ProductModel } from "@/generated/prisma/models";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/action-button";
import { deleteProductServer } from "../actions/server/deleteProductServer";
import { toast } from "sonner";

export default function AllProductsTable() {
  const { data: products } = useSuspenseQuery({
    queryKey: ["products"],
    queryFn: getProductsServer,
  });
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sl</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Purchase Price</TableHead>
            <TableHead>Sell Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={6}>
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia>
                      <IconPackages />
                    </EmptyMedia>
                    <EmptyTitle>No products found</EmptyTitle>
                  </EmptyHeader>
                </Empty>
              </TableCell>
            </TableRow>
          )}
          {products.map((product, index) => (
            <TableRow key={product.name}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Image
                    className="rounded-xs"
                    src={product.images[0]}
                    layout="constrained"
                    width={50}
                    height={50}
                    alt=""
                  />
                </div>
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.purchasePrice}</TableCell>
              <TableCell>{product.sellPrice}</TableCell>
              <TableCell>
                <ProductsTableActions product={product} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ProductsTableActions({ product }: { product: ProductModel }) {
  const queryClient = useQueryClient();
  async function handleDeleteProduct(productId: ProductModel["id"]) {
    try {
      await deleteProductServer({
        data: { productId },
      });
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete product"
      );
    } finally {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  }
  return (
    <div className="flex items-center gap-2">
      <Button size="icon" asChild>
        <Link
          to={`/dashboard/products/edit/$productId`}
          params={{ productId: String(product.id) }}
        >
          <IconPencil />
        </Link>
      </Button>
      <ActionButton
        action={async () => await handleDeleteProduct(product.id)}
        requireAreYouSure
        variant="destructive"
      >
        <IconTrash />
      </ActionButton>
    </div>
  );
}
