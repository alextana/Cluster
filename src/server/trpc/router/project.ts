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
  getStats: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      // get stats
      const totalTasks = await ctx.prisma.task.count({
        where: {
          projectId: input,
        },
      });

      const completedTasks = await ctx.prisma.task.count({
        where: {
          projectId: input,
          status: "closed",
        },
      });

      const totalMilestones = await ctx.prisma.milestone.count({
        where: {
          projectId: input,
        },
      });

      const completedMilestones = await ctx.prisma.milestone.count({
        where: {
          projectId: input,
          status: "closed",
        },
      });

      return {
        tasks: {
          total: totalTasks,
          completed: completedTasks,
        },
        milestones: {
          total: totalMilestones,
          completed: completedMilestones,
        },
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
