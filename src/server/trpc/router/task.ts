import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const taskRouter = router({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.task.findMany();
  }),
  getAllById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      let tasks = null;

      tasks = await ctx.prisma.task.findMany({
        where: {
          projectId: id,
        },
      });

      return {
        tasks,
      };
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        status: z.string(),
        description: z.string().nullish(),
        created_at: z.date().nullish(),
        projectId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, status, description, created_at, projectId } = input;
      const task = await ctx.prisma.task.create({
        data: {
          name: name,
          status: status,
          description: description,
          created_at: created_at,
          projectId: projectId,
        },
      });

      return task;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const deleted = await ctx.prisma.task.delete({
        where: {
          id: id,
        },
      });

      return deleted;
    }),
});
