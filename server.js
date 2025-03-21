import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "node:path";
import helmet from "helmet";
import cors from "cors";
import { fileURLToPath } from "node:url";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors()); // <--- Lägg till CORS här

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/favicon.ico", express.static(path.join(__dirname, "favicon.ico")));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https://books-1-cbvn.onrender.com"],
      },
    },
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
});
const Book = mongoose.model("Book", BookSchema, "book_collection");

// Route för att hämta alla böcker
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
