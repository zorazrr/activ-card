import { Badge } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const badgeRouter = createTRPCRouter({
  createBadge: publicProcedure
    .input(
      z.object({
        data: z.string(),
        userId: z.string(),
        setId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("CHAL");
      const set = await ctx.db.set.findUnique({
        where: {
          id: input.setId,
        },
      });
      console.log("VASU");

      if (set) {
        console.log("here");
        console.log({
          url: input.data,
          student_id: input.userId,
          set_id: input.setId,
          classroom_id: set.classroom_id,
        });
        const badge = await ctx.db.badge.create({
          data: {
            url: Buffer.from(input.data, "base64"),
            student_id: input.userId,
            set_id: input.setId,
            classroom_id: set.classroom_id,
          },
        });
        return badge;
      }
    }),
  getBadgesByClassroom: publicProcedure
    .input(z.object({ classId: z.string() }))
    .query(async ({ ctx, input }) => {
      const badges: Badge[] = await ctx.db.badge.findMany({
        where: {
          classroom_id: input.classId,
        },
      });
      return badges;
    }),
});
