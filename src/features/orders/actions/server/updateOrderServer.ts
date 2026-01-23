import { prisma } from "@/db";
import { createServerFn } from "@tanstack/react-start";
import { createOrEditOrderSchema } from "../../types/orderTypes";
import { OrderModel } from "@/generated/prisma/models";
import z from "zod";

export const updateOrderServer = createServerFn()
  .inputValidator(
    (data: {
      orderId: OrderModel["id"];
      updatedData: z.infer<typeof createOrEditOrderSchema>;
    }) => data,
  )
  .handler(async ({ data: { orderId, updatedData } }) => {
    // 1. Fetch the real products from the DB to get current 'sellPrice'
    // This prevents users from tampering with prices on the client side.
    const productIds = updatedData.orderItems.map((item) => item.productId);

    const dbProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
      select: {
        id: true,
        name: true,
        sellPrice: true,
      },
    });

    // Quick lookup map
    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    // 2. Prepare the data for the 'OrderItem' table (The Snapshot)
    // We verify product existence and calculate the REAL total here.
    let calculatedTotalPrice = 0;

    const orderItemsData = updatedData.orderItems.map((item) => {
      const product = productMap.get(item.productId);

      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }

      // Calculate line total for backend verification
      calculatedTotalPrice += product.sellPrice * item.quantity;

      return {
        // Relation: Connect to the Product
        productId: item.productId,

        // Snapshot: Save the Name/Price AS IT IS NOW.
        // If you change the product name/price next week, this order record remains historically accurate.
        name: product.name,
        price: product.sellPrice,

        quantity: item.quantity,
      };
    });

    // Add shipping to the backend-calculated total
    calculatedTotalPrice += updatedData.shippingCharge;

    // 3. Perform the Transaction
    // Prisma handles the "Foreign Key" linking automatically via the nested 'create'
    const newOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        // Simple composite type mapping
        customer: updatedData.customer,

        // Use the secure, calculated total
        totalPrice: calculatedTotalPrice,
        shippingCharge: updatedData.shippingCharge,
        orderStatus: updatedData.orderStatus,

        // The Magic Part: Creating the relations
        // Prisma will create these OrderItem records AND insert the new order.id into them automatically.
        orderItems: {
          create: orderItemsData,
        },
      },
    });

    return newOrder;
  });
