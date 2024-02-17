import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const studentRouter = createTRPCRouter({
  // GET
  getStudents: publicProcedure.input(z.object({})).query(({ ctx }) => {
    const sets = ctx.db.student.findMany();
  }),
});
