import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { gptRouter } from "./routers/gpt";
import { setsRouter } from "./routers/sets";
import { studentsRouter } from "./routers/students";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  gpt: gptRouter,
  sets: setsRouter,
  students: studentsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
