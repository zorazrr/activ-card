import { createTRPCRouter } from "~/server/api/trpc";
import { gptRouter } from "./routers/gpt";
import { studentRouter } from "./routers/student";
import { setRouter } from "./routers/set";
import { cardRouter } from "./routers/card";
import { classroomRouter } from "./routers/classroom";
import { teacherRouter } from "./routers/teacher";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  gpt: gptRouter,
  student: studentRouter,
  classroom: classroomRouter,
  set: setRouter,
  card: cardRouter,
  teacher: teacherRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
