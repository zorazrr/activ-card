import { z } from "zod";

import {
    createTRPCRouter,
    publicProcedure,
} from "~/server/api/trpc";


export const setsRouter = createTRPCRouter({
    getSets: publicProcedure.input(z.object({})).query(({ ctx }) => {
        const sets = ctx.db.set.findMany();
        return "hi";
    })
})