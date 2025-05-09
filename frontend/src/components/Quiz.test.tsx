import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Quiz from "./Quiz";
import quizReducer from "../features/quiz/quizSlice";

// Mock the Redux store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      quiz: quizReducer,
    },
    preloadedState: initialState,
  });
};

describe("Quiz", () => {
  const mockQuestions = [
    {
      _id: "1",
      question: "What is the capital of France?",
      allAnswers: ["London", "Paris", "Berlin", "Madrid"],
    },
    {
      _id: "2",
      question: "Which planet is known as the Red Planet?",
      allAnswers: ["Venus", "Mars", "Jupiter", "Saturn"],
    },
  ];

  const mockResults = {
    score: 2,
    results: [
      {
        question: "What is the capital of France?",
        selectedAnswer: "Paris",
        correctAnswer: "Paris",
        isCorrect: true,
        allAnswers: ["London", "Paris", "Berlin", "Madrid"],
      },
      {
        question: "Which planet is known as the Red Planet?",
        selectedAnswer: "Venus",
        correctAnswer: "Mars",
        isCorrect: false,
        allAnswers: ["Venus", "Mars", "Jupiter", "Saturn"],
      },
    ],
  };

  const renderComponent = (initialState = {}) => {
    const store = createMockStore({
      quiz: {
        questions: mockQuestions,
        answers: {},
        results: null,
        loading: false,
        ...initialState,
      },
    });

    return render(
      <Provider store={store}>
        <Quiz />
      </Provider>
    );
  };

  describe("Quiz Mode", () => {
    it("renders questions and answers", () => {
      renderComponent();

      expect(screen.getByText("Quiz")).toBeInTheDocument();
      expect(
        screen.getByText("What is the capital of France?")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Which planet is known as the Red Planet?")
      ).toBeInTheDocument();

      // Check if all answer options are rendered
      mockQuestions[0].allAnswers.forEach((answer) => {
        expect(screen.getByText(answer)).toBeInTheDocument();
      });
    });

    it("allows selecting answers", () => {
      renderComponent();

      const firstAnswer = screen.getByText("Paris");
      fireEvent.click(firstAnswer);

      expect(firstAnswer).toHaveClass("selected");
    });

    it("enables submit button when all questions are answered", () => {
      const store = createMockStore({
        quiz: {
          questions: mockQuestions,
          answers: {
            "1": "Paris",
            "2": "Mars",
          },
          results: null,
          loading: false,
        },
      });

      render(
        <Provider store={store}>
          <Quiz />
        </Provider>
      );

      const submitButton = screen.getByRole("button", {
        name: "Submit Answers",
      });
      expect(submitButton).not.toBeDisabled();
    });

    it("disables submit button when not all questions are answered", () => {
      renderComponent();

      const submitButton = screen.getByRole("button", {
        name: "Submit Answers",
      });
      expect(submitButton).toBeDisabled();
    });
  });

  describe("Results Mode", () => {
    it("renders results with score", () => {
      renderComponent({
        results: mockResults,
      });

      expect(screen.getByText("Quiz Results")).toBeInTheDocument();
      expect(screen.getByText("Score: 2/5")).toBeInTheDocument();
    });

    it("shows correct and incorrect answers", () => {
      renderComponent({
        results: mockResults,
      });

      const correctAnswer = screen.getByText("Paris");
      const incorrectAnswer = screen.getByText("Venus");

      expect(correctAnswer).toHaveClass("correct");
      expect(incorrectAnswer).toHaveClass("incorrect");
    });

    it("allows starting a new quiz", async () => {
      const store = createMockStore({
        quiz: {
          questions: mockQuestions,
          answers: {},
          results: mockResults,
          loading: false,
        },
      });

      render(
        <Provider store={store}>
          <Quiz />
        </Provider>
      );

      const newQuizButton = screen.getByRole("button", {
        name: "Start New Quiz",
      });
      fireEvent.click(newQuizButton);

      await waitFor(() => {
        const state = store.getState();
        expect(state.quiz.results).toBeNull();
      });
    });
  });
});
