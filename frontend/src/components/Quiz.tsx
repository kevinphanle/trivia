import { useDispatch, useSelector } from "react-redux";
import { setAnswer, submitQuiz, resetQuiz } from "../features/quiz/quizSlice";
import type { AppDispatch, RootState } from "../app/store";
import { useCallback, useMemo, memo } from "react";
import "./Quiz.css";

interface Question {
  _id: string;
  question: string;
  allAnswers: string[];
}

interface QuizResult {
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  allAnswers: string[];
}

// Memoized Answer Button Component
const AnswerButton = memo(
  ({
    answer,
    isSelected,
    isCorrect,
    onClick,
  }: {
    answer: string;
    isSelected: boolean;
    isCorrect?: boolean;
    onClick?: () => void;
  }) => {
    const buttonClass = useMemo(() => {
      if (isCorrect !== undefined) {
        return isCorrect ? "correct" : isSelected ? "incorrect" : "";
      }
      return isSelected ? "selected" : "";
    }, [isSelected, isCorrect]);

    return (
      <button
        onClick={onClick}
        className={`answer-button ${buttonClass}`}
        dangerouslySetInnerHTML={{ __html: answer }}
      />
    );
  }
);

// Memoized Question Component
const QuestionCard = memo(
  ({
    question,
    answers,
    selectedAnswer,
    correctAnswer,
    onSelect,
  }: {
    question: string;
    answers: string[];
    selectedAnswer?: string;
    correctAnswer?: string;
    onSelect?: (answer: string) => void;
  }) => {
    return (
      <div className="quiz-question">
        <p dangerouslySetInnerHTML={{ __html: question }} />
        <div className="answers-container">
          {answers.map((answer) => (
            <AnswerButton
              key={answer}
              answer={answer}
              isSelected={answer === selectedAnswer}
              isCorrect={correctAnswer ? answer === correctAnswer : undefined}
              onClick={onSelect ? () => onSelect(answer) : undefined}
            />
          ))}
        </div>
      </div>
    );
  }
);

export default function Quiz() {
  const dispatch = useDispatch<AppDispatch>();
  const { questions, answers, results } = useSelector(
    (state: RootState) => state.quiz
  );

  const isComplete = useMemo(
    () =>
      questions.length > 0 && Object.keys(answers).length === questions.length,
    [questions.length, answers]
  );

  const handleSelect = useCallback(
    (questionId: string, selectedAnswer: string) => {
      dispatch(setAnswer({ questionId, selectedAnswer }));
    },
    [dispatch]
  );

  const handleSubmit = useCallback(() => {
    const formatted = questions.map((q: Question) => ({
      questionId: q._id,
      selectedAnswer: answers[q._id],
    }));
    dispatch(submitQuiz(formatted));
  }, [dispatch, questions, answers]);

  const handleRestart = useCallback(() => {
    dispatch(resetQuiz());
  }, [dispatch]);

  const scoreClass = useMemo(() => {
    if (!results) return "";
    const score = results.score;
    return score >= 4 ? "good" : score >= 2 ? "medium" : "poor";
  }, [results]);

  if (!questions.length) return null;

  if (results) {
    const score = results.score;
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <h2>Quiz Results</h2>
        </div>
        {results.results.map((res: QuizResult, idx: number) => (
          <QuestionCard
            key={idx}
            question={res.question}
            answers={res.allAnswers}
            selectedAnswer={res.selectedAnswer}
            correctAnswer={res.correctAnswer}
          />
        ))}

        <div className="quiz-header">
          <div className="score-display">Score: {score}/5</div>
          <div className={`score-indicator ${scoreClass}`} />
        </div>

        <button onClick={handleRestart} className="submit-button">
          Start New Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>Quiz</h2>
      </div>
      {questions.map((q: Question) => (
        <QuestionCard
          key={q._id}
          question={q.question}
          answers={q.allAnswers}
          selectedAnswer={answers[q._id]}
          onSelect={(answer) => handleSelect(q._id, answer)}
        />
      ))}

      <button
        disabled={!isComplete}
        onClick={handleSubmit}
        className="submit-button"
      >
        Submit Answers
      </button>
    </div>
  );
}
