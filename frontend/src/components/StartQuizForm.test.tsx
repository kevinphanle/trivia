import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import StartQuizForm from "./StartQuizForm";
import categoryReducer from "../features/categories/categorySlice";
import quizReducer from "../features/quiz/quizSlice";

// Mock the Redux store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      category: categoryReducer,
      quiz: quizReducer,
    },
    preloadedState: initialState,
  });
};

describe("StartQuizForm", () => {
  const mockCategories = [
    { id: 9, name: "General Knowledge" },
    { id: 10, name: "Entertainment: Books" },
  ];

  const renderComponent = (initialState = {}) => {
    const store = createMockStore({
      category: {
        list: mockCategories,
        loading: false,
        error: null,
      },
      ...initialState,
    });

    return render(
      <Provider store={store}>
        <StartQuizForm />
      </Provider>
    );
  };

  it("renders the form with initial state", () => {
    renderComponent();

    expect(screen.getByText("Start Your Quiz")).toBeInTheDocument();
    expect(
      screen.getByText("Select a category and difficulty to begin")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Category")).toBeInTheDocument();
    expect(screen.getByLabelText("Difficulty")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Start Quiz" })).toBeDisabled();
  });

  it("shows loading state", () => {
    renderComponent({
      category: {
        list: [],
        loading: true,
        error: null,
      },
    });

    expect(screen.getByText("Loading categories...")).toBeInTheDocument();
    expect(screen.getByLabelText("Category")).toBeDisabled();
    expect(screen.getByLabelText("Difficulty")).toBeDisabled();
  });

  it("populates category select with options", () => {
    renderComponent();

    const categorySelect = screen.getByLabelText("Category");
    expect(categorySelect).toHaveValue("");

    const categoryOptions = within(categorySelect).getAllByRole("option");
    expect(categoryOptions).toHaveLength(3); // Default option + 2 categories
    expect(categoryOptions[1]).toHaveTextContent("General Knowledge");
    expect(categoryOptions[2]).toHaveTextContent("Entertainment: Books");
  });

  it("enables start button when category is selected", () => {
    renderComponent();

    const startButton = screen.getByRole("button", { name: "Start Quiz" });
    expect(startButton).toBeDisabled();

    const categorySelect = screen.getByLabelText("Category");
    fireEvent.change(categorySelect, { target: { value: "9" } });

    // Wait for the button to be enabled
    waitFor(() => {
      expect(startButton).not.toBeDisabled();
    });
  });

  it("allows difficulty selection", () => {
    renderComponent();

    const difficultySelect = screen.getByLabelText("Difficulty");
    expect(difficultySelect).toHaveValue("easy");

    fireEvent.change(difficultySelect, { target: { value: "medium" } });
    expect(difficultySelect).toHaveValue("medium");

    fireEvent.change(difficultySelect, { target: { value: "hard" } });
    expect(difficultySelect).toHaveValue("hard");
  });

  it("dispatches fetchQuiz action when start button is clicked", async () => {
    const store = createMockStore({
      category: {
        list: mockCategories,
        loading: false,
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <StartQuizForm />
      </Provider>
    );

    const categorySelect = screen.getByLabelText("Category");
    fireEvent.change(categorySelect, { target: { value: "9" } });

    const startButton = screen.getByRole("button", { name: "Start Quiz" });
    fireEvent.click(startButton);

    // Wait for the action to be dispatched
    await waitFor(() => {
      const state = store.getState();
      expect(state.quiz.questions).toBeDefined();
    });
  });
});
