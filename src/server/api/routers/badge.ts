import { Badge } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const badgeRouter = createTRPCRouter({
  createBadge: publicProcedure
    .input(
      z.object({
        genImageURL: z.string(),
        presignedURL: z.string(),
        fileName: z.string(),
        userId: z.string(),
        setId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const response = await fetch(input.genImageURL);

      if (!response.ok)
        throw new Error("Failed to fetch the file from the provided URL.");
      const fileBlob = await response.blob();

      await fetch(input.presignedURL, {
        method: "PUT",
        headers: {
          "Content-Type": fileBlob.type,
        },
        body: fileBlob,
      });
      const set = await ctx.db.set.findUnique({
        where: {
          id: input.setId,
        },
      });

      const student = await ctx.db.student.findUnique({
        where: {
          user_id: input.userId,
        },
      });

      if (set && student) {
        const badge = await ctx.db.badge.create({
          data: {
            filename: input.fileName,
            student_id: student.id,
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
      const s3BaseUrl = `https://${process.env.REACT_APP_S3_BUCKET_NAME}.s3.${process.env.REACT_APP_AWS_REGION}.amazonaws.com`;
      const badges: Badge[] = await ctx.db.badge.findMany({
        where: {
          classroom_id: input.classId,
        },
      });
      return badges.map((badge) => `${s3BaseUrl}/${badge.filename}`);
    }),
});
