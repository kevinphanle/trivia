import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "../features/categories/categorySlice";
import quizReducer from "../features/quiz/quizSlice";

export const store = configureStore({
  reducer: {
    category: categoryReducer,
    quiz: quizReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["quiz/submitQuiz/fulfilled"],
        ignoredActionPaths: ["payload.results"],
        ignoredPaths: ["quiz.results"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
