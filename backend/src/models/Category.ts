import mongoose, { Document, Schema } from "mongoose";

interface ICategory extends Document {
  id: number;
  name: string;
}

const categorySchema = new Schema<ICategory>({
  id: Number,
  name: String,
});

export default mongoose.model<ICategory>("Category", categorySchema);
