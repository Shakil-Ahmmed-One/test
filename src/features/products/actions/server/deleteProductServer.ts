import { ProductModel } from "@/generated/prisma/models";
import { prisma } from "@/db";
import { createServerFn } from "@tanstack/react-start";

export const deleteProductServer = createServerFn()
  .inputValidator((data: { productId: ProductModel["id"] }) => data)
  .handler(async ({ data: { productId } }) => {
    await prisma.product.delete({
      where: {
        id: productId,
      },
    });
  });
