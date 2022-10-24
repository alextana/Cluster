import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { User } from "@prisma/client";

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

      // TODO - pair users to tasks

      return {
        tasks,
      };
    }),
  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.findUnique({
        where: {
          id: input,
        },
      });

      let assigned_to: User[] = [];
      let project = null;

      if (task) {
        assigned_to = await ctx.prisma.user.findMany({
          where: {
            taskId: task.id as string,
          },
        });
        project = await ctx.prisma.project.findUnique({
          where: {
            id: task.projectId as string,
          },
        });
      }
      return {
        task: task,
        project: project,
        assigned_to: assigned_to,
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
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const deleted = await ctx.prisma.task.delete({
        where: {
          id: input,
        },
      });

      return deleted;
    }),
  changeStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, status } = input;
      const task = await ctx.prisma.task.update({
        where: {
          id: id,
        },
        data: {
          status: status,
        },
      });
      return task;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.string().nullish(),
        description: z.string().nullish(),
        name: z.string(),
        estimated_time: z.date().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      if (!input.name) {
        input.name = "";
      }

      const task = await ctx.prisma.task.update({
        where: {
          id: id,
        },
        data: input,
      });

      return task;
    }),
});
