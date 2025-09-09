import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { prisma } from "../db";
import type { Prisma } from "@prisma/client";
import { on } from "events";

// Named type keeps TS happy with Prisma includes
export type MessageWithSender = Prisma.MessageGetPayload<{
  include: { sender: true };
}>;

export const messagesRouter = router({
  // Fetch all messages in a thread
  list: publicProcedure
    .input(z.object({ threadId: z.number() }))
    .query(({ input }) => {
      return prisma.message.findMany({
        where: { threadId: input.threadId },
        include: { sender: true },
        orderBy: { createdAt: "asc" },
      });
    }),

  // Send a new message (persist, then broadcast)
  send: publicProcedure
    .input(
      z.object({
        threadId: z.number(),
        senderId: z.number(),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const msg = await prisma.message.create({
        data: {
          content: input.content,
          threadId: input.threadId,
          senderId: input.senderId,
        },
        include: { sender: true },
      });

      // Broadcast to subscribers of this thread
      ctx.events.emit(`message:${input.threadId}`, msg);
      return msg;
    }),

  // Real-time subscription (tRPC v11 async generator style)
  onMessage: publicProcedure
    .input(z.object({ threadId: z.number() }))
    .subscription(async function* ({ input, ctx, signal }) {
      // Stream EventEmitter events until the client disconnects
      for await (const [msg] of on(ctx.events, `message:${input.threadId}`, {
        signal,
      })) {
        yield msg as MessageWithSender;
      }
    }),
});
