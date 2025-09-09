import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../shared/trpc";
import { httpBatchLink, splitLink } from "@trpc/client";
import { wsLink, createWSClient } from '@trpc/client';

export const trpc = createTRPCReact<AppRouter>();

export function createClient() {
  const wsClient = createWSClient({ url: "ws://localhost:4000" });

  return trpc.createClient({
    links: [
      splitLink({
        condition: (op) => op.type === "subscription",
        true: wsLink({ client: wsClient }),
        false: httpBatchLink({ url: "http://localhost:4000/trpc" }),
      }),
    ],
  });
}