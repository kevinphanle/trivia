import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Question {
  _id: string;
  question: string;
  category: string;
  difficulty: string;
  allAnswers: string[];
}

interface QuizParams {
  category: string;
  difficulty: string;
  amount: number;
}

interface Answer {
  questionId: string;
  selectedAnswer: string;
}

interface QuizResult {
  score: number;
  results: {
    question: string;
    selectedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    allAnswers: string[];
  }[];
}

interface QuizState {
  questions: Question[];
  answers: Record<string, string>;
  results: QuizResult | null;
  loading: boolean;
}

export const fetchQuiz = createAsyncThunk<Question[], QuizParams>(
  "quiz/fetchQuiz",
  async ({ category, difficulty, amount }) => {
    const res = await axios.get<Question[]>(
      `http://localhost:5001/api/quiz?category=${category}&difficulty=${difficulty}&amount=${amount}`
    );
    return res.data;
  }
);

export const submitQuiz = createAsyncThunk<QuizResult, Answer[]>(
  "quiz/submitQuiz",
  async (answers) => {
    const res = await axios.post<QuizResult>(
      `http://localhost:5001/api/quiz/score`,
      {
        answers,
      }
    );
    return res.data;
  }
);

const initialState: QuizState = {
  questions: [],
  answers: {},
  results: null,
  loading: false,
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setAnswer: (
      state,
      action: PayloadAction<{ questionId: string; selectedAnswer: string }>
    ) => {
      const { questionId, selectedAnswer } = action.payload;
      state.answers[questionId] = selectedAnswer;
    },
    resetQuiz: (state) => {
      state.questions = [];
      state.answers = {};
      state.results = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuiz.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchQuiz.fulfilled,
        (state, action: PayloadAction<Question[]>) => {
          state.questions = action.payload;
          state.loading = false;
        }
      )
      .addCase(
        submitQuiz.fulfilled,
        (state, action: PayloadAction<QuizResult>) => {
          state.results = action.payload;
        }
      );
  },
});

export const { setAnswer, resetQuiz } = quizSlice.actions;
export default quizSlice.reducer;
