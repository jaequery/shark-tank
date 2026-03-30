import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";
import { generateEvaluation } from "../openrouter";
import { TRPCError } from "@trpc/server";

export const evaluationRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findUnique({ where: { email: ctx.session.user.email! } });
    if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

    return prisma.evaluation.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: { scores: true },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await prisma.user.findUnique({ where: { email: ctx.session.user.email! } });
      if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

      const evaluation = await prisma.evaluation.findUnique({
        where: { id: input.id },
        include: { scores: true },
      });
      if (!evaluation || evaluation.userId !== user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return evaluation;
    }),

  generate: protectedProcedure
    .input(z.object({ intro: z.string().trim().min(1).max(5000) }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.email!;
      const user = await prisma.user.findUnique({ where: { email: userId } });
      if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

      const result = await generateEvaluation(input.intro);

      const overallScore = Math.round(result.scores.reduce((sum, s) => sum + s.score, 0) / result.scores.length);

      const episodeJson = JSON.stringify(result.episode);

      return prisma.evaluation.create({
        data: {
          userId: user.id,
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

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await prisma.user.findUnique({ where: { email: ctx.session.user.email! } });
      if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

      const evaluation = await prisma.evaluation.findUnique({ where: { id: input.id } });
      if (!evaluation) throw new TRPCError({ code: "NOT_FOUND" });
      if (evaluation.userId !== user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You can only delete your own evaluations" });
      }

      return prisma.evaluation.delete({ where: { id: input.id } });
    }),
});
