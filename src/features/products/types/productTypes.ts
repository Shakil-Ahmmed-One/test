import z from "zod";

export const createOrEditProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  images: z.array(z.url()).min(1, "At least one image is required"),
  purchasePrice: z.number().nonnegative(),
  sellPrice: z.number().nonnegative(),
});

export type CreateOrEditProductType = z.infer<typeof createOrEditProductSchema>;
