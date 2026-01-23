import { prisma } from "@/db";
import { createServerFn } from "@tanstack/react-start";
import { customerDetailsInOrderSchema } from "../../types/orderTypes";

export const getOrdersServer = createServerFn().handler(async () => {
  const orders = await prisma.order.findMany({
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  const ordersWithCustomerDetails = orders.map((order) => {
    const customerDetails = customerDetailsInOrderSchema.parse(order.customer);
    return { ...order, customer: customerDetails };
  });

  return ordersWithCustomerDetails;
});
