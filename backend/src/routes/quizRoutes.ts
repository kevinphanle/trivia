import express, { Request, Response } from "express";
import Category from "../models/Category";
import Question from "../models/Question";

const router = express.Router();

router.get("/categories", async (req: Request, res: Response) => {
  const categories = await Category.find();
  res.json(categories);
});

router.get("/quiz", async (req: Request, res: Response) => {
  const { category, difficulty, amount } = req.query;

  const questions = await Question.aggregate([
    { $match: { categoryId: parseInt(category as string), difficulty } },
    { $sample: { size: parseInt(amount as string) || 5 } },
    {
      $project: {
        question: 1,
        category: 1,
        difficulty: 1,
        allAnswers: 1,
        _id: 1,
      },
    },
  ]);

  res.json(questions);
});

interface Answer {
  questionId: string;
  selectedAnswer: string;
}

router.post(
  "/quiz/score",
  async (req: Request<{}, {}, { answers: Answer[] }>, res: Response) => {
    const { answers } = req.body;
    let score = 0;
    const detailedResults = [];

    for (const { questionId, selectedAnswer } of answers) {
      const question = await Question.findById(questionId);
      const isCorrect = question?.correctAnswer === selectedAnswer;

      if (isCorrect) score++;

      detailedResults.push({
        question: question?.question,
        selectedAnswer,
        correctAnswer: question?.correctAnswer,
        isCorrect,
        allAnswers: question?.allAnswers,
      });
    }

    res.json({ score, results: detailedResults });
  }
);

export default router;
