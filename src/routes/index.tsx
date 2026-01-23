import { SignInForm } from "@/features/auth/components/SignInForm";
import { generateMetadata } from "@/lib/tanstack-meta/generator";
import { avoidRedundantAuthMiddleware } from "@/middleware/authMiddleware";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => generateMetadata({ title: "Sign In" }),
  component: RouteComponent,
  server: {
    middleware: [avoidRedundantAuthMiddleware],
  },
});

function RouteComponent() {
  return (
    <main className="min-h-dvh flex items-center justify-center gap-6">
      <SignInForm />
    </main>
  );
}
