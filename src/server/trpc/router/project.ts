import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const projectRouter = router({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.project.findMany();
  }),
  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        getMilestones: z.boolean().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id, getMilestones } = input;
      let project = null;
      let milestones = null;

      project = await ctx.prisma.project.findUnique({
        where: {
          id: id,
        },
      });

      if (getMilestones) {
        milestones = await ctx.prisma.milestone.findMany({
          where: {
            projectId: id,
          },
        });
      }

      return {
        project: project,
        milestones: milestones,
      };
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        status: z.string(),
        description: z.string().nullish(),
        created_at: z.date().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, status, description, created_at } = input;
      const project = await ctx.prisma.project.create({
        data: {
          name: name,
          status: status,
          description: description,
          created_at: created_at,
        },
      });

      return project;
    }),
});
