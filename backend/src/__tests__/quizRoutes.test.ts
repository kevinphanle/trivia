import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import quizRoutes from "../routes/quizRoutes";
import Category from "../models/Category";
import Question from "../models/Question";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use("/api", quizRoutes);

describe("Quiz Routes", () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/quiz_test"
    );
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear collections before each test
    await Category.deleteMany({});
    await Question.deleteMany({});
  });

  describe("GET /api/categories", () => {
    it("should return all categories", async () => {
      // Create test category
      const category = await Category.create({
        id: 11,
        name: "Test Category",
      });

      const response = await request(app).get("/api/categories").expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe("Test Category");
    });
  });

  describe("GET /api/quiz", () => {
    it("should return questions based on query parameters", async () => {
      // Create test question
      await Question.create({
        categoryId: 11,
        difficulty: "easy",
        question: "Test question?",
        correctAnswer: "Correct",
        allAnswers: ["Correct", "Wrong1", "Wrong2", "Wrong3"],
      });

      const response = await request(app)
        .get("/api/quiz?category=11&difficulty=easy&amount=1")
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].question).toBe("Test question?");
    });
  });

  describe("POST /api/quiz/score", () => {
    it("should calculate score and return detailed results", async () => {
      // Create test question
      const question = await Question.create({
        categoryId: 11,
        difficulty: "easy",
        question: "Test question?",
        correctAnswer: "Correct",
        allAnswers: ["Correct", "Wrong1", "Wrong2", "Wrong3"],
      });

      const response = await request(app)
        .post("/api/quiz/score")
        .send({
          answers: [
            {
              questionId: question._id,
              selectedAnswer: "Correct",
            },
          ],
        })
        .expect(200);

      expect(response.body.score).toBe(1);
      expect(response.body.results).toHaveLength(1);
      expect(response.body.results[0].isCorrect).toBe(true);
    });
  });
});
