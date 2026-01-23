import { useSuspenseQuery } from "@tanstack/react-query";
import { checkIsAuthenticatedServer } from "../actions/server";

export default function SignedIn({ children }: { children: React.ReactNode }) {
  const { data } = useSuspenseQuery({
    queryKey: ["isAuthenticated"],
    queryFn: checkIsAuthenticatedServer,
  });

  const { isAuthenticated } = data;

  if (!isAuthenticated) {
    return null;
  }

  return children;
}
