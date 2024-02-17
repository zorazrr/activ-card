import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { gptRouter } from "./routers/gpt";
import { studentRouter } from "./routers/student";
import { setRouter } from "./routers/set";
import { classroomRouter } from "./routers/classroom";
import { teacherRouter } from "./routers/teacher";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  gpt: gptRouter,
  student: studentRouter,
  classroom: classroomRouter,
  set: setRouter,
  teacher: teacherRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
