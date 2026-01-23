import { LandingPageModel } from "@/generated/prisma/models";
import { prisma } from "@/db";
import { createServerFn } from "@tanstack/react-start";

export const deleteLandingPageServer = createServerFn()
  .inputValidator((data: { landingPageId: LandingPageModel["id"] }) => data)
  .handler(async ({ data: { landingPageId } }) => {
    await prisma.landingPage.delete({
      where: {
        id: landingPageId,
      },
    });
  });
