import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const studentRouter = createTRPCRouter({
  // GET
  // This gets a student's information and is useful when we display the student's dashboard and could potentially be useful for student metrics + management.
  getStudentInfo: publicProcedure
    .input(z.object({ studentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const student = await ctx.db.student.findMany({
        where: {
          id: input.studentId,
        },
      });
      return student;
    }),

  // TODO: PUT + Docs (make sure to update the classroom list )
  // addStudent: publicProcedure
  //   .input(z.object({ classroomId: z.string() }))
  //   .query(({ ctx, input }) => {
  //     const sets = ctx.db.student.findMany({
  //       where: {
  //         classroom_id: input.classroomId,
  //       },
  //     });
  //   }),

  // TODO: PUT + Docs
  // addClassroomForStudent: publicProcedure
  //   .input(z.object({ classroomId: z.string() }))
  //   .query(({ ctx, input }) => {
  //     const sets = ctx.db.student.findMany({
  //       where: {
  //         classroom_id: input.classroomId,
  //       },
  //     });
  //   }),

  // TODO: PUT + Docs
  //   addBadgeForStudent: publicProcedure.input(z.object({})).query(({ ctx }) => {
  //     const sets = ctx.db.student.findMany();
  //   }),
});
