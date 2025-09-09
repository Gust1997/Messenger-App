import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { prisma } from "../db";
import { Prisma } from "@prisma/client";

export const threadsRouter = router({
  list: publicProcedure
  .input(z.object({ currentUser: z.string() }))
  .query(({ input }): Promise<Prisma.ThreadGetPayload<{ include: { userA: true; userB: true } }>[]> => {
    return prisma.thread.findMany({
      where: {
        OR: [
          { userA: { username: input.currentUser } },
          { userB: { username: input.currentUser } },
        ],
      },
      include: { userA: true, userB: true },
      orderBy: { id: "asc" },
    });
  }),

  create: publicProcedure
    .input(z.object({ currentUser: z.string(), targetUser: z.string() }))
    .mutation(async ({ input }) => {
      const user1 = await prisma.user.findUnique({
        where: { username: input.currentUser },
      });
      const user2 = await prisma.user.findUnique({
        where: { username: input.targetUser },
      });

      if (!user1 || !user2) {
        throw new Error("User not found");
      }

      const [id1, id2] =
        user1.id < user2.id ? [user1.id, user2.id] : [user2.id, user1.id];

      const thread = await prisma.thread.upsert({
        where: { userAId_userBId: { userAId: id1, userBId: id2 } },
        update: {},
        create: { userAId: id1, userBId: id2 },
        include: { userA: true, userB: true },
      });

      return thread;
    }),
});