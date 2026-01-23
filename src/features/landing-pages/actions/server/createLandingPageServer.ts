import { prisma } from "@/db";
import { createServerFn } from "@tanstack/react-start";
import { createOrEditLandingPageSchema } from "../../types/landingPageTypes";

export const createLandingPageServer = createServerFn()
  .inputValidator(createOrEditLandingPageSchema)
  .handler(async ({ data }) => {
    const productsDetails = data.landingPageProducts.map((product) => ({
      productId: product.productId,
      description: product.description,
      faqs: product.faqs,
    }));
    const landingPage = await prisma.landingPage.create({
      data: {
        name: data.name,
        slug: data.slug,
        landingPageProducts: {
          create: productsDetails,
        },
      },
    });
    return landingPage;
  });
