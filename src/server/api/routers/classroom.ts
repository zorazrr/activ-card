import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const classroomRouter = createTRPCRouter({
  // GET
  // Get a classroom's information. Helpful for further populating student and teacher dashboards.
  getClassroom: publicProcedure
    .input(z.object({ classId: z.string() }))
    .query(({ ctx, input }) => {
      const classrooms = ctx.db.classroom.findMany({
        where: {
          id: input.classId,
        },
      });
      return classrooms;
    }),

  // ADD
  // addClassroomForTeacher: publicProcedure // Should also add classroom to teacher obj
  //   .input(z.object({}))
  //   .query(({ ctx }) => {
  //     const sets = ctx.db.classroom.findMany();
  //   }),
});
