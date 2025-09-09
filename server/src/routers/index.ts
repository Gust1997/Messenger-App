import { router } from "../trpc";
import { authRouter } from "./auth";
import { messagesRouter } from "./messages";
import { threadsRouter } from "./threads";

export const appRouter = router({
    auth: authRouter,
    threads: threadsRouter,
    messages: messagesRouter
});
export type AppRouter = typeof appRouter;