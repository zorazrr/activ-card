import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const classroomsRouter = createTRPCRouter({
  // TODO: GET classrooms of teacher
  getClassroomsForTeacher: publicProcedure
    .input(z.object({}))
    .query(({ ctx }) => {
      const sets = ctx.db.classroom.findMany();
    }),

  // TODO: GET classrooms of student
  getClassroomsForStudent: publicProcedure
    .input(z.object({}))
    .query(({ ctx }) => {
      const sets = ctx.db.classroom.findMany();
    }),

  // ADD
  addClassroomForTeacher: publicProcedure
    .input(z.object({}))
    .query(({ ctx }) => {
      const sets = ctx.db.classroom.findMany();
    }),

  // TODO
  addStudentToClassroom: publicProcedure
    .input(z.object({}))
    .query(({ ctx }) => {
      const sets = ctx.db.classroom.findMany();
    }),

  // TODO
  addSetToClassroom: publicProcedure.input(z.object({})).query(({ ctx }) => {
    const sets = ctx.db.classroom.findMany();
  }),
});
