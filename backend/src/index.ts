import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import quizRoutes from "./routes/quizRoutes";

dotenv.config();

const app = express();

// CORS configuration
app.use(cors()); // Allow all origins during development

app.use(express.json());
app.use("/api", quizRoutes);

mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () =>
      console.log(`Server running on http://localhost:${process.env.PORT}`)
    );
  })
  .catch((err: Error) => console.error(err));
