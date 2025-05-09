import mongoose, { Document, Schema } from "mongoose";

interface IQuestion extends Document {
  categoryId: number;
  category: string;
  difficulty: string;
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  allAnswers: string[];
}

const questionSchema = new Schema<IQuestion>({
  categoryId: Number,
  category: String,
  difficulty: String,
  question: String,
  correctAnswer: String,
  incorrectAnswers: [String],
  allAnswers: [String],
});

export default mongoose.model<IQuestion>("Question", questionSchema);
