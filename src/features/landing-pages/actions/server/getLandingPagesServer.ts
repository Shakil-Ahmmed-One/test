import { prisma } from "@/db";
import { createServerFn } from "@tanstack/react-start";

export const getLandingPagesServer = createServerFn().handler(async () => {
  const landingPages = await prisma.landingPage.findMany();
  return landingPages;
});
