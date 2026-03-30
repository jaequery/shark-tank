-- CreateTable
CREATE TABLE "Evaluation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectName" TEXT NOT NULL,
    "projectUrl" TEXT,
    "description" TEXT NOT NULL,
    "askAmount" TEXT,
    "narration" TEXT NOT NULL,
    "pitch" TEXT NOT NULL,
    "sharkDialog" TEXT NOT NULL,
    "theGood" TEXT NOT NULL,
    "theConcerns" TEXT NOT NULL,
    "hardQuestions" TEXT NOT NULL,
    "verdict" TEXT NOT NULL,
    "deal" TEXT,
    "overallScore" INTEGER NOT NULL,

    CONSTRAINT "Evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluationScore" (
    "id" TEXT NOT NULL,
    "evaluationId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "oneLiner" TEXT NOT NULL,

    CONSTRAINT "EvaluationScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EvaluationScore_evaluationId_category_key" ON "EvaluationScore"("evaluationId", "category");

-- AddForeignKey
ALTER TABLE "EvaluationScore" ADD CONSTRAINT "EvaluationScore_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "Evaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
