import { z } from "zod";

// 2. Customer Schema
export const customerDetailsInOrderSchema = z.object({
  name: z.string().min(1, "Customer Name is required"),
  mobileNumber: z.string().min(11, "Mobile number must be valid"), // Adjusted for typical length
  address: z.string().min(1, "Address is required"),
});

export type TCustomerDetailsInOrder = z.infer<
  typeof customerDetailsInOrderSchema
>;

// 3. Order Item Schema (The input from the cart/form)
const orderItemInputSchema = z.object({
  productId: z.number("Product ID is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export const orderStatuses = ["pending", "delivered", "cancelled"] as const;

export type TOrderStatus = (typeof orderStatuses)[number];

// 4. Main Create Order Schema
export const createOrEditOrderSchema = z.object({
  customer: customerDetailsInOrderSchema,

  // Matches 'orderItems' relation in your Prisma schema
  orderItems: z
    .array(orderItemInputSchema)
    .min(1, "Order must contain at least one product"),

  // These are usually calculated on the frontend for display,
  // but MUST be recalculated/verified on the backend!
  totalPrice: z.number().nonnegative("Total price cannot be negative"),
  shippingCharge: z.number().nonnegative("Shipping charge cannot be negative"),

  // Optional: Allow status override if this is an admin edit
  orderStatus: z.enum(orderStatuses),

  // Optional: Landing page ID for tracking orders from specific landing pages
  landingPageId: z.number().optional(),
});

// 5. Type Inference (Handy for your frontend props or API handlers)
export type CreateOrEditOrderType = z.infer<typeof createOrEditOrderSchema>;
