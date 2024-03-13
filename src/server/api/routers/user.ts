import { Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getRoleEnum } from "~/utils/helpers";

export const userRouter = createTRPCRouter({
  setUserRole: publicProcedure
    .input(z.object({ name: z.string(), userId: z.string(), role: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          id: input.userId,
        },
      });

      console.log(getRoleEnum(input.role));

      if (user && user.role !== Role.UNKNOWN) {
        return user; // ensures user role is set only once
      }

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const updatedUser = await ctx.db.user.update({
        where: {
          id: input.userId,
        },
        data: {
          role: getRoleEnum(input.role),
        },
      });

      if (getRoleEnum(input.role) == Role.TEACHER) {
        await ctx.db.teacher.create({
          data: {
            name: input.name,
            user_id: input.userId,
          },
        });
      } else if (getRoleEnum(input.role) == Role.STUDENT) {
        await ctx.db.student.create({
          data: {
            name: input.name,
            user_id: input.userId,
          },
        });
      }

      return updatedUser;
    }),
});
