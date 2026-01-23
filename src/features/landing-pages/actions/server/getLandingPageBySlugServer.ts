import { prisma } from "@/db";
import { createServerFn } from "@tanstack/react-start";
import { landingPageProductFaqsSchema } from "../../types/landingPageTypes";

export const getLandingPageBySlugServer = createServerFn()
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const landingPage = await prisma.landingPage.findUnique({
      where: {
        slug: data.slug,
      },
      include: {
        landingPageProducts: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!landingPage) {
      return null;
    }

    const landingPageProducts = landingPage.landingPageProducts.map(
      (lpProduct) => {
        const faqs = landingPageProductFaqsSchema.parse(lpProduct.faqs);

        return {
          ...lpProduct,
          faqs,
        };
      },
    );

    return { ...landingPage, landingPageProducts };
  });
