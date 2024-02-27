import { Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getRoleEnum } from "~/utils/helpers";

export const userRouter = createTRPCRouter({
    setUserRole: publicProcedure.input(z.object({ userId: z.string(), role: z.string() })).mutation(async ({ ctx, input }) => {
        const user = await ctx.db.user.findUnique({
            where: {
                id: input.userId,
            },
        });

        console.log(getRoleEnum(input.role));

        if (!user || user.role !== Role.UNKNOWN) {
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
        return updatedUser;
    }),
});
