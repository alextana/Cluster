import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const commentRouter = router({
  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const comment = await ctx.prisma.comment.findUnique({
        where: {
          id: input,
        },
      });

      return comment;
    }),
  create: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        content: z.string(),
        taskId: z.string(),
        created_at: z.date().nullish(),
        updated_at: z.date().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, created_at, content, updated_at, taskId } = input;
      const comment = await ctx.prisma.comment.create({
        data: {
          userId: userId,
          created_at: created_at,
          content: content,
          updated_at: updated_at,
          taskId: taskId,
        },
      });

      return comment;
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.prisma.comment.delete({
        where: {
          id: input,
        },
      });

      return comment;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        content: z.string(),
        updated_at: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const comment = await ctx.prisma.comment.update({
        where: {
          id: id,
        },
        data: input,
      });

      return comment;
    }),
});
