import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { prisma } from "../db"
import bcrypt from "bcryptjs"

export const authRouter = router({
  login: publicProcedure
    .input(z.object({ username: z.string().min(1), password: z.string().min(1) }))
    .mutation(async ({ input }) => {
        const { username, password } = input;

        const user = await prisma.user.findUnique({
            where: { username },
            select: {id: true, username: true, password: true }
        });

        if (!user) {
            console.log("User not found")
            throw new Error;
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            console.log("Wrong password")
            throw new Error;
        }

        console.log("User found", user.username);
        return { ok: true as const, user: {id: user.id, username: user.username}};
    })
});