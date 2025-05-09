import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
import Category from "../models/Category";
import Question from "../models/Question";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

interface TriviaCategory {
  id: number;
  name: string;
}

interface TriviaQuestion {
  category: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface TriviaResponse {
  results: TriviaQuestion[];
}

const shuffleArray = <T>(arr: T[]): T[] =>
  [...arr].sort(() => Math.random() - 0.5);

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry<T>(
  url: string,
  maxRetries = 3,
  baseDelay = 2000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await axios.get<T>(url);
      return response.data;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const waitTime = baseDelay * Math.pow(2, i);
      console.log(`Retrying after ${waitTime}ms...`);
      await delay(waitTime);
    }
  }
  throw new Error("Max retries reached");
}

async function seedDatabase(): Promise<void> {
  try {
    await mongoose.connect(MONGO_URI || "");
    console.log("Connected to MongoDB");

    await Category.deleteMany();
    await Question.deleteMany();

    // Fetch and store categories
    const categoryData = await fetchWithRetry<{
      trivia_categories: TriviaCategory[];
    }>("https://opentdb.com/api_category.php");
    const categories = categoryData.trivia_categories;

    await Category.insertMany(categories);
    console.log("Categories seeded");

    // Fetch and store questions for each category
    for (const cat of categories) {
      try {
        const url = `https://opentdb.com/api.php?amount=5&category=${cat.id}&difficulty=easy&type=multiple`;
        const data = await fetchWithRetry<TriviaResponse>(url);

        const formatted = data.results.map((q) => ({
          categoryId: cat.id,
          category: q.category,
          difficulty: q.difficulty,
          question: q.question,
          correctAnswer: q.correct_answer,
          incorrectAnswers: q.incorrect_answers,
          allAnswers: shuffleArray([q.correct_answer, ...q.incorrect_answers]),
        }));

        await Question.insertMany(formatted);
        console.log(`Questions for ${cat.name} seeded`);

        // Add a delay between categories to prevent rate limiting
        await delay(3000);
      } catch (error) {
        console.error(`Error seeding questions for ${cat.name}:`, error);
        // Continue with next category even if one fails
        continue;
      }
    }

    console.log("Seeding complete");
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
