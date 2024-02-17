import { z } from "zod";
import type { Set } from "@prisma/client";

import {
    createTRPCRouter,
    publicProcedure,
} from "~/server/api/trpc";


export const setRouter = createTRPCRouter({
    getAllSets: publicProcedure.input(z.object({})).query(async ({ ctx }) => {
        const sets: Set[] = await ctx.db.set.findMany();
        return sets;
    }),
    getSetByClassroom: publicProcedure.input(z.object({ classId: z.string() })).query(async ({ ctx, input }) => {
        const sets: Set[] = await ctx.db.set.findMany({
            where: {
                classroom_id: input.classId,
            },
        });
        return sets;
    })
})