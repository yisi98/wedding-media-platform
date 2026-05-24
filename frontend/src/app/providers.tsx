"use client";
import "@/lib/i18n"; // initialise i18next before anything renders
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
  }));

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
