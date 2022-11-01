// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { projectRouter } from "./project";
import { taskRouter } from "./task";
import { authRouter } from "./auth";
import { userRouter } from "./user";
import { teamRouter } from "./team";
import { commentRouter } from "./comment";
import { milestoneRouter } from "./milestone";
import { organisationRouter } from "./organisation";

export const appRouter = router({
  project: projectRouter,
  milestone: milestoneRouter,
  task: taskRouter,
  team: teamRouter,
  comment: commentRouter,
  auth: authRouter,
  user: userRouter,
  organisation: organisationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
