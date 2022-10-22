import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const milestoneRouter = router({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.milestone.findMany();
  }),
  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      let milestone = null;

      milestone = await ctx.prisma.milestone.findUnique({
        where: {
          id: id,
        },
      });

      return {
        milestone: milestone,
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
      const milestone = await ctx.prisma.milestone.create({
        data: {
          name: name,
          status: status,
          description: description,
          created_at: created_at,
          projectId: projectId,
        },
      });

      return milestone;
    }),
});
