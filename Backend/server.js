import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import Groq from "groq-sdk";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.use("/api", chatRoutes);

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected with Database!");
  } catch (err) {
    console.log("Failed to connect with Db", err);
  }
};

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
};

startServer();

app.post("/test", async (req, res) => {
  try {

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: req.body.message
        }
      ]
    });

    const reply = completion.choices[0].message.content;

    res.json({ reply });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "AI request failed" });
  }
});