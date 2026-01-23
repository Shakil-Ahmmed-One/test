import { prisma } from "@/db";
import { createServerFn } from "@tanstack/react-start";
import { createOrEditProductSchema } from "../../types/productTypes";
import { ProductModel } from "@/generated/prisma/models";
import z from "zod";

export const updateProductServer = createServerFn()
  .inputValidator(
    (data: {
      productId: ProductModel["id"];
      updatedData: z.infer<typeof createOrEditProductSchema>;
    }) => data,
  )
  .handler(async ({ data: { productId, updatedData } }) => {
    await prisma.product.update({
      where: {
        id: productId,
      },
      data: updatedData,
    });
  });
