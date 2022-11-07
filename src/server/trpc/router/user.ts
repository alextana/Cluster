import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const userRouter = router({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),
  getAllByOrganisationId: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const userOrgs = await ctx.prisma.usersOnOrganisations.findMany({
        where: {
          organisationId: input,
        },
      });

      const userIds = userOrgs.map((f) => f.userId);

      const users = await ctx.prisma.user.findMany({
        where: {
          id: { in: userIds },
        },
      });

      return users;
    }),
  getAllAssigned: protectedProcedure
    .input(z.array(z.string()).nullish())
    .query(async ({ ctx, input }) => {
      if (!input) return;

      const usersOnTasks = await ctx.prisma.usersOnTasks.findMany({
        where: {
          taskId: { in: input },
        },
      });

      const userIds = Array.from(new Set(usersOnTasks?.map((f) => f.userId)));

      const users = await ctx.prisma.user.findMany({
        where: {
          id: { in: userIds },
        },
      });
      return users;
    }),
  getAvailableAndAssigned: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        orgId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { orgId, taskId } = input;
      const userOrgs = await ctx.prisma.usersOnOrganisations.findMany({
        where: {
          organisationId: orgId,
        },
      });

      const userIds = userOrgs.map((f) => f.userId);

      const users = await ctx.prisma.user.findMany({
        where: {
          id: { in: userIds },
        },
      });

      // TO CHECK THIS
      const assignedToTask = await ctx.prisma.user.findMany({
        where: {
          id: { in: userIds },
        },
        select: {
          UsersOnTasks: {
            where: {
              taskId: taskId,
            },
          },
        },
      });

      const assigned = assignedToTask[0]?.UsersOnTasks;

      const result = users?.filter((c) =>
        assigned?.some((s) => s.userId === c.id)
      );

      return {
        users,
        assignedToTask: result,
      };
    }),
  getAssignedByTask: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { taskId } = input;
      const assignedToTask = await ctx.prisma.usersOnTasks.findMany({
        where: {
          taskId: taskId,
        },
      });

      const userIds = assignedToTask.map((user) => user.userId);

      const users = await ctx.prisma.user.findMany({
        where: {
          id: { in: userIds },
        },
      });

      return users;
    }),
  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      let user = null;

      user = await ctx.prisma.user.findUnique({
        where: {
          id: id,
        },
        include: {
          UsersOnOrganisations: true,
        },
      });

      // TODO - pair users to tasks
      return user;
    }),
});
