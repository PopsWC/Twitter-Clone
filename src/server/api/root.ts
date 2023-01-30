import { createTRPCRouter } from "./trpc";
import { userRouter } from "./routers/userRouter";
import { tweetRouter } from "./routers/tweetRouter"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  userRouter: userRouter,
  tweetRouter: tweetRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
