import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
  HeadContent,
  Link,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";
import { useStore } from "@tanstack/react-store";
import { store } from "@/lib/store";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        name: "description",
        content:
          "A high-performance, type-safe, and server-rendered (SSR) Todo application. This project serves as a comprehensive demonstration of the TanStack ecosystem, featuring advanced patterns like Optimistic UI, URL-synced state, and SSR-compliant theme management.",
      },
      { title: "Full-Stack TanStack Todo App" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
  errorComponent: ({ error }) => (
    <div className="bg-gray-100">
      <div className="h-screen flex flex-col justify-center items-center">
        <p className="text-2xl font-medium text-gray-800">{String(error)}</p>
        <Link
          to="/"
          search={{ status: "all", page: 1, pageSize: 5 }}
          className="mt-2 text-xl text-blue-600 hover:underline"
        >
          Go back home
        </Link>
      </div>
    </div>
  ),
  notFoundComponent: () => (
    <div className="bg-gray-100">
      <div className="h-screen flex flex-col justify-center items-center">
        <h1 className="text-8xl font-bold text-gray-800">404</h1>
        <p className="text-4xl font-medium text-gray-800">Page Not Found</p>
        <Link
          to="/"
          search={{ status: "all", page: 1, pageSize: 5 }}
          className="mt-2 text-xl text-blue-600 hover:underline"
        >
          Go back home
        </Link>
      </div>
    </div>
  ),
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const theme = useStore(store, (state) => state.settings.theme);

  return (
    // Why suppressHydrationWarning?
    // This is the standard way to handle attributes that must differ between server and client (like themes or timestamps). It tells React: "I know the className might change immediately on the client; please don't trigger a full-page hydration error for this specific element."
    <html lang="en" className={theme} suppressHydrationWarning>
      <head>
        <HeadContent />
        {/* This script runs BEFORE the page is visible to the user */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 'dark';
                document.documentElement.classList.toggle('dark', theme === 'dark');
                document.documentElement.classList.toggle('light', theme === 'light');
              })()
            `,
          }}
        />
      </head>
      <body>
        {children}
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
        <Scripts />
      </body>
    </html>
  );
}
