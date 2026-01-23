import { checkIsAuthenticatedServer } from "@/features/auth/actions/server";
import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";

export const protectedMiddleware = createMiddleware().server(
  async ({ next }) => {
    const { isAuthenticated } = await checkIsAuthenticatedServer();
    if (!isAuthenticated) {
      throw redirect({ to: "/" });
    }

    return await next();
  }
);

export const avoidRedundantAuthMiddleware = createMiddleware().server(
  async ({ next }) => {
    const { isAuthenticated } = await checkIsAuthenticatedServer();
    if (isAuthenticated) {
      throw redirect({ to: "/dashboard" });
    }

    return await next();
  }
);
