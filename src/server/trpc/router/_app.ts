// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { projectRouter } from "./project";
import { taskRouter } from "./task";
import { authRouter } from "./auth";
import { milestoneRouter } from "./milestone";

export const appRouter = router({
  project: projectRouter,
  milestone: milestoneRouter,
  task: taskRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
