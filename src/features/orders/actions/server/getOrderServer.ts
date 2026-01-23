import { OrderFindUniqueArgs } from "@/generated/prisma/models";
import { prisma } from "@/db";
import { createServerFn } from "@tanstack/react-start";
import { notFound } from "@tanstack/react-router";
import { customerDetailsInOrderSchema } from "../../types/orderTypes";

export const getOrderServer = createServerFn()
  .inputValidator((orderId: OrderFindUniqueArgs["where"]["id"]) => orderId)
  .handler(async ({ data: orderId }) => {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (order == null) {
      throw notFound();
    }

    const customerDetails = customerDetailsInOrderSchema.parse(order.customer);

    return { ...order, customer: customerDetails };
  });
