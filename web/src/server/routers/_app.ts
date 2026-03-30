import { router } from "../trpc";
import { evaluationRouter } from "./evaluation";

export const appRouter = router({
  evaluation: evaluationRouter,
});

export type AppRouter = typeof appRouter;
