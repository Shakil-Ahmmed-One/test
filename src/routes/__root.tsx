import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

import appCss from "../styles/global.css?url";

import type { QueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { generateMetadata } from "@/lib/tanstack-meta/generator";
import { checkIsAuthenticatedServer } from "@/features/auth/actions/server";
import RootProviders from "./-providers";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData({
      queryKey: ["isAuthenticated"],
      queryFn: checkIsAuthenticatedServer,
    });
  },
  head: () => ({
    ...generateMetadata({
      charSet: "utf-8",
      viewport: {
        width: "device-width",
        initialScale: 1,
      },
    }),
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script
          crossOrigin="anonymous"
          src="https://tweakcn.com/live-preview.min.js"
        />
      </head>
      <body>
        <RootProviders>
          {children}
          {process.env.NODE_ENV === "development" && (
            <TanStackDevtools
              config={{
                position: "bottom-right",
              }}
              plugins={[
                {
                  name: "Tanstack Router",
                  render: <TanStackRouterDevtoolsPanel />,
                },
                TanStackQueryDevtools,
              ]}
            />
          )}
          <Toaster richColors closeButton />
        </RootProviders>
        <Scripts />
      </body>
    </html>
  );
}
