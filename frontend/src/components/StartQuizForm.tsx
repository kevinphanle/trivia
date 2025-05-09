import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../features/categories/categorySlice";
import { fetchQuiz } from "../features/quiz/quizSlice";
import type { AppDispatch, RootState } from "../app/store";
import { useCallback, useMemo } from "react";
import "./StartQuizForm.css";

export default function StartQuizForm() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    list: categories,
    loading,
    error,
  } = useSelector((state: RootState) => state.category);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const category = formData.get("category") as string;
      const difficulty = formData.get("difficulty") as string;

      dispatch(fetchQuiz({ category, difficulty, amount: 5 }));
    },
    [dispatch]
  );

  const categoryOptions = useMemo(() => {
    if (loading) {
      return <option value="">Loading categories...</option>;
    }

    if (error) {
      return <option value="">Error: {error}</option>;
    }

    if (!categories.length) {
      return <option value="">No categories available</option>;
    }

    return (
      <>
        <option value="">Select a category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </>
    );
  }, [categories, loading, error]);

  return (
    <div className="start-quiz-container">
      <h2>Start Your Quiz</h2>
      <p>Select a category and difficulty to begin</p>

      <form onSubmit={handleSubmit} className="quiz-form">
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            required
            disabled={loading}
            className="form-select"
          >
            {categoryOptions}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="difficulty">Difficulty:</label>
          <select
            id="difficulty"
            name="difficulty"
            required
            disabled={loading}
            className="form-select"
          >
            <option value="easy">Easy</option>
            <option value="medium" disabled>
              Medium
            </option>
            <option value="hard" disabled>
              Hard
            </option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || !categories.length}
          className="start-button"
        >
          Start Quiz
        </button>
      </form>
    </div>
  );
}
