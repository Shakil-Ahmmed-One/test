import z from "zod";

export const createOrEditLandingPageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  landingPageProducts: z
    .array(
      z.object({
        productId: z.number("Product ID is required"),
        description: z.string().min(1, "Description is required"),
        faqs: z
          .array(
            z.object({
              question: z.string().min(1, "Question is required"),
              answer: z.string().min(1, "Answer is required"),
            }),
          )
          .min(1, "At least one FAQ is required"),
      }),
    )
    .min(1, "At least one product is required"),
});

export const landingPageProductFaqsSchema = z.array(
  z.object({
    question: z.string().min(1, "Question is required"),
    answer: z.string().min(1, "Answer is required"),
  }),
);

export type LandingPageProductFaqsType = z.infer<
  typeof landingPageProductFaqsSchema
>;

export type CreateOrEditLandingPageType = z.infer<
  typeof createOrEditLandingPageSchema
>;
