import { ProductFindUniqueArgs } from "@/generated/prisma/models";
import { prisma } from "@/db";
import { createServerFn } from "@tanstack/react-start";
import { notFound } from "@tanstack/react-router";

export const getProductServer = createServerFn()
  .inputValidator(
    (productId: ProductFindUniqueArgs["where"]["id"]) => productId,
  )
  .handler(async ({ data: productId }) => {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (product == null) {
      throw notFound();
    }
    return product;
  });
