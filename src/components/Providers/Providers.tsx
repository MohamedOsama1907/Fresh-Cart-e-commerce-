"use client";

import { myStore } from "@/store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, useState } from "react";
import { Provider } from "react-redux";

export default function Providers({ children }: { children: ReactNode }) {
  // Keep the same QueryClient instance across re-renders to preserve the React Query cache.
  const [queryClient] = useState(() => new QueryClient());

  return (
    <Provider store={myStore}>
      <QueryClientProvider client={queryClient}>{children}
        <ReactQueryDevtools position="bottom" initialIsOpen={false}/>
      </QueryClientProvider>
    </Provider>
  );
}
