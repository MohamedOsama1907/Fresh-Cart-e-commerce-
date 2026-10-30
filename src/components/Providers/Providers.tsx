"use client";

import { createStore, preloadedState } from "@/store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, useState } from "react";
import { Provider } from "react-redux";
import { CartAnimationProvider } from "@/features/cart/components/CartAnimationProvider";

export default function Providers({
  children,
  preloadedState,
}: {
  children: ReactNode;
  preloadedState: preloadedState;
}) {
  // Keep the same QueryClient instance across re-renders to preserve the React Query cache.
  const [queryClient] = useState(() => new QueryClient());
  const [myStore] = useState(() => createStore(preloadedState));
  return (
    <Provider store={myStore}>
      <QueryClientProvider client={queryClient}>
        <CartAnimationProvider>{children}</CartAnimationProvider>
        <ReactQueryDevtools position="bottom" initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  );
}
