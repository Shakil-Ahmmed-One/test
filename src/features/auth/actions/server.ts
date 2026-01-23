import { signInSchema, signUpSchema } from "@/features/auth/types/authTypes";
import { auth } from "@/lib/auth";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

// Sign Up
export const signUpServer = createServerFn()
  .inputValidator(signUpSchema)
  .handler(async ({ data }) => {
    const { user } = await auth.api.signUpEmail({
      body: {
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL: "/dashboard",
      },
    });
    return { user };
  });

// Sign In
export const signInServer = createServerFn()
  .inputValidator(signInSchema)
  .handler(async ({ data }) => {
    const { user } = await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
        callbackURL: "/dashboard",
      },
    });
    return { user };
  });

// Sign Out
export const signOutServer = createServerFn().handler(async () => {
  const { success } = await auth.api.signOut({
    headers: getRequestHeaders(),
  });
  return { success };
});

// Get Session
export const getSessionServer = createServerFn().handler(async () => {
  const session = await auth.api.getSession({
    headers: getRequestHeaders(),
  });
  return session;
});

// Check Is Authenticated
export const checkIsAuthenticatedServer = createServerFn().handler(async () => {
  const session = await getSessionServer();
  return { isAuthenticated: !!session };
});

// Get User
export const getUserServer = createServerFn().handler(async () => {
  const session = await getSessionServer();
  return { user: session?.user || null };
});
