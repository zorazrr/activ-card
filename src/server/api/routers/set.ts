import { z } from "zod";
import { type Set } from "@prisma/client";

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
        // TODO: Get interleaved sets selected and duplicate cards
        // Also pass in pomodoro options etc

        // TODO: Create set config
        // model SetConfig {
        //   id       String  @id @default(auto()) @map("_id") @db.ObjectId
        //   set_id   String  @db.ObjectId @unique
        //   set      Set     @relation(fields: [set_id], references: [id], onDelete: Cascade)
        //   type SetType
        //   pomodoro Boolean  @default(false)
        //   pomodoroTimer Int? @default(60)
        //   pomodoroCards Int? @default(5)
        // }

        data: {
          name: input.name,
          description: "",
          classroom_id: input.classId,
          config: {
            create: {
              type: "INVERTED",
              pomodoro: true,
              pomodoroTimer: 25,
              pomodoroCards: 10,
            },
          },
        },
        include: {
          config: true,
        },
      });
      return set;
    }),
  updateSet: publicProcedure
    .input(
      z.object({
        setId: z.string(),
        setName: z.string(),
        setDescription: z.string(),
        cards: z.array(z.object({ term: z.string(), def: z.string() })),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Delete existing cards
      await ctx.db.card.deleteMany({
        where: {
          set: {
            id: input.setId,
          },
        },
      });

      // Create new cards
      const setUpdate = await ctx.db.set.update({
        where: {
          id: input.setId,
        },
        data: {
          name: input.setName,
          description: input.setDescription,
          cards: {
            createMany: {
              data: input.cards.map((card) => ({
                term: card.term,
                definition: card.def,
              })),
            },
          },
        },
      });

      return setUpdate;
    }),
});
