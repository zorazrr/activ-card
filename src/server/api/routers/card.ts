import { z } from "zod";
import type { Set, Card } from "@prisma/client";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const cardRouter = createTRPCRouter({
  getCardsBySet: publicProcedure
    .input(z.object({ setId: z.string() }))
    .query(async ({ ctx, input }) => {
      const cards: Card[] = await ctx.db.card.findMany({
        where: {
          set_id: input.setId,
        },
      });
      return cards;
    }),
  createCardsforSet: publicProcedure
    .input(
      z.object({
        setId: z.string(),
        cards: z.array(z.object({ term: z.string(), def: z.string() })),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newCards: Card[] = await Promise.all(
        input.cards.map(async (card) => {
          return await ctx.db.card.create({
            data: {
              term: card.term,
              definition: card.def,
              set_id: input.setId,
            },
          });
        }),
      );
      const setUpdate: Set = await ctx.db.set.update({
        where: {
          id: input.setId,
        },
        data: {
          cards: {
            connect: newCards.map((card) => {
              return { id: card.id };
            }),
          },
        },
        include: {
          cards: true,
        },
      });
      return setUpdate;
    }),
});
