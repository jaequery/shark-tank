import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";
import { generateEvaluation } from "../openrouter";

export const evaluationRouter = router({
  list: publicProcedure.query(async () => {
    return prisma.evaluation.findMany({
      orderBy: { createdAt: "desc" },
      include: { scores: true },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return prisma.evaluation.findUnique({
        where: { id: input.id },
        include: { scores: true },
      });
    }),

  generate: publicProcedure
    .input(z.object({ intro: z.string().min(1).max(5000) }))
    .mutation(async ({ input }) => {
      const result = await generateEvaluation(input.intro);

      const overallScore = Math.round(result.scores.reduce((sum, s) => sum + s.score, 0) / result.scores.length);

      // Serialize the episode array into the existing text fields for storage.
      // We store the full episode JSON in sharkDialog and leave the legacy
      // fields populated with sensible defaults.
      const episodeJson = JSON.stringify(result.episode);

      return prisma.evaluation.create({
        data: {
          projectName: result.projectName,
          description: input.intro,
          narration: result.narration,
          pitch: "",
          sharkDialog: episodeJson,
          theGood: "",
          theConcerns: "",
          hardQuestions: "",
          verdict: "",
          deal: result.deal,
          overallScore,
          scores: {
            create: result.scores,
          },
        },
        include: { scores: true },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return prisma.evaluation.delete({ where: { id: input.id } });
    }),
});
