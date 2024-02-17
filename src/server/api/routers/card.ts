import { z } from "zod";
import type { Set } from "@prisma/client";

import {
    createTRPCRouter,
    publicProcedure,
} from "~/server/api/trpc";


export const cardRouter = createTRPCRouter({
    getSetByClassroom: publicProcedure.input(z.object({ classId: z.string() })).query(async ({ ctx, input }) => {
        const sets: Set[] = await ctx.db.set.findMany({
            where: {
                classroom_id: input.classId,
            },
        });
        return sets;
    })
})