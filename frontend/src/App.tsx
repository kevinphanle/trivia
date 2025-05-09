import { useSelector } from "react-redux";
import type { RootState } from "./app/store";
import StartQuizForm from "./components/StartQuizForm";
import Quiz from "./components/Quiz";
import "./App.css";

function App() {
  const { questions } = useSelector((state: RootState) => state.quiz);

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1>Trivia App</h1>
        </div>
      </header>
      <main className="app-main">
        <div className="container">
          {questions.length === 0 ? <StartQuizForm /> : <Quiz />}
        </div>
      </main>
    </div>
  );
}

export default App;
