"use client";

import React, { useEffect, useState } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            refetchOnMount: true,
            refetchOnWindowFocus: true,
          },
        },
      }),
  );

  useEffect(() => {
    if (user) {
      queryClient.invalidateQueries();
      queryClient.clear();
    }
  }, [user, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
