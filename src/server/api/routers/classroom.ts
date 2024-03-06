import { TRPCError } from "@trpc/server";
import { truncate } from "fs";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const classroomRouter = createTRPCRouter({
  // GET
  // Get a classroom's information. Helpful for further populating student and teacher dashboards.
  getClassroom: publicProcedure
    .input(z.object({ classId: z.string() }))
    .query(async ({ ctx, input }) => {
      const classrooms = await ctx.db.classroom.findMany({
        where: {
          id: input.classId,
        },
      });
      return classrooms;
    }),

  // ADD
  addClassroomForTeacher: publicProcedure // Should also add classroom to teacher obj
    .input(z.object({ teacherId: z.string(), className: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const teacher = await ctx.db.teacher.findUnique({
        where: {
          user_id: input.teacherId,
        },
      });

      if (!teacher) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "teacher not found",
        });
      }

      const classroom = await ctx.db.classroom.create({
        data: {
          name: input.className,
          teacher_id: teacher.id,
        },
      });

      const teach = await ctx.db.teacher.update({
        where: {
          id: teacher.id,
        },
        data: {
          classroom: {
            connect: { id: classroom.id }, // Connect the new classroom to the teacher
          },
        },
        include: {
          classroom: true, // Include the classrooms in the returned object
        },
      });

      return classroom;
    }),
});
