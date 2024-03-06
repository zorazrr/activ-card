import { z } from "zod";
import { AnswerMode, CheckMode, type Set } from "@prisma/client";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const setRouter = createTRPCRouter({
  deleteSet: publicProcedure
    .input(z.object({ setId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const deletedSet = await ctx.db.set.delete({
        where: {
          id: input.setId,
        },
      });
      return deletedSet;
    }),
  getAllSets: publicProcedure.input(z.object({})).query(async ({ ctx }) => {
    const sets: Set[] = await ctx.db.set.findMany();
    return sets;
  }),
  getOneSet: publicProcedure
    .input(z.object({ setId: z.string() }))
    .query(async ({ ctx, input }) => {
      const set: Set | null = await ctx.db.set.findUnique({
        where: {
          id: input.setId,
        },
        include: {
          cards: true,
        },
      });
      return set;
    }),
  getSetByClassroom: publicProcedure
    .input(z.object({ classId: z.string() }))
    .query(async ({ ctx, input }) => {
      const sets: Set[] = await ctx.db.set.findMany({
        where: {
          classroom_id: input.classId,
        },
        include: {
          cards: true,
        },
      });
      return sets;
    }),
  createSet: publicProcedure
    .input(z.object({ name: z.string(), classId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const set = await ctx.db.set.create({
        data: {
          name: input.name,
          description: "",
          classroom_id: input.classId,
          check_mode: CheckMode.AI_CHECK,
          answer_mode: AnswerMode.SPEAKING,
          pomodoro: false,
        },
      });
      return set;
    }),
});
