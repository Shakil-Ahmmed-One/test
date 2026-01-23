import { SignUpForm } from "@/features/auth/components/SignUpForm";
import { avoidRedundantAuthMiddleware } from "@/middleware/authMiddleware";
import { createFileRoute } from "@tanstack/react-router";
import { generateMetadata } from "tanstack-meta";

export const Route = createFileRoute("/(auth)/sign-up/")({
  head: () => generateMetadata({ title: "Sign Up" }),
  component: RouteComponent,
  server: {
    middleware: [avoidRedundantAuthMiddleware],
  },
});

function RouteComponent() {
  return (
    <main className="min-h-dvh flex items-center justify-center p-6">
      <SignUpForm />
    </main>
  );
}
