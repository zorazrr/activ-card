import { Teacher } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const teacherRouter = createTRPCRouter({
  // GET
  // Allows you to get a teacher's information (name, classroooms)
  // Useful for teacher dashboard to populate the classrooms
  getTeacherAndClassrooms: publicProcedure
    .input(z.object({ teacherId: z.string() }))
    .query(async ({ ctx, input }) => {
      const teacher: Teacher[] = await ctx.db.teacher.findMany({
        where: {
          id: input.teacherId,
        },
      });
      return teacher;
    }),
});
