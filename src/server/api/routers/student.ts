import { Student } from "@prisma/client";
import { TRPCError } from "@trpc/server";
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
  getStudentAndClassrooms: publicProcedure
    .input(z.object({ studentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const student: Student | null = await ctx.db.student.findUnique({
        where: {
          user_id: input.studentId,
        },
        include: {
          classrooms: true,
        },
      });
      return student;
    }),
  joinStudentToClassroom: publicProcedure // Should also add classroom to teacher obj
    .input(z.object({ studentId: z.string(), classCode: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const classCodeInfo = await ctx.db.classCode.findUnique({
        where: {
          code: input.classCode,
        },
      });

      console.log(classCodeInfo);
      console.log(input.classCode);
      console.log(input.studentId);

      if (!classCodeInfo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "inputted code not found",
        });
      }

      const student = await ctx.db.student.update({
        where: {
          user_id: input.studentId,
        },
        data: {
          classrooms: {
            connect: { id: classCodeInfo.classroom_id }, // Connect the new classroom to the teacher
          },
        },
        include: {
          classrooms: true, // Include the classrooms in the returned object
        },
      });

      const classroom = await ctx.db.classroom.update({
        where: {
          id: classCodeInfo.classroom_id,
        },
        data: {
          students: {
            connect: { id: student.id }, // Connect the new classroom to the teacher
          },
        },
        include: {
          students: true, // Include the classrooms in the returned object
        },
      });

      // generate classroom code

      return {
        class: classroom,
      };
    }),
});
