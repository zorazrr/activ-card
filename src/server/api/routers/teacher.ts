import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const teacherRouter = createTRPCRouter({
  // TODO: GET teacher
  getTeacher: publicProcedure.input(z.object({})).query(({ ctx }) => {
    const sets = ctx.db.classroom.findMany();
  }),

  // TODO: Add to teacher
  addClassroomToTeacher: publicProcedure
    .input(z.object({}))
    .query(({ ctx }) => {
      const sets = ctx.db.classroom.findMany();
    }),
});
