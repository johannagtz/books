import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "node:path";
import helmet from "helmet";
import { fileURLToPath } from "node:url";

dotenv.config();
const app = express();
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(
  "/favicon.ico",
  express.static(path.join(process.cwd(), "favicon.ico"))
);

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

const ItemSchema = new mongoose.Schema({ name: String });
const Item = mongoose.model("Item", ItemSchema);

app.get("/items", async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

app.listen(3000, () => console.log("Server running on port 3000"));
