import { useSelector } from "react-redux";
import StartQuizForm from "./components/StartQuizForm";
import Quiz from "./components/Quiz";
import type { RootState } from "./app/store";

function App() {
  const { questions } = useSelector((state: RootState) => state.quiz);

  if (questions.length > 0) return <Quiz />;
  return <StartQuizForm />;
}

export default App;
