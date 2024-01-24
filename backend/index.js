import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

// Enable CORS
app.use(cors());

// Login API
app.post("/api/login", async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
    res.status(200).json({ text: "Failed to login" });
  }
});

// Generate API
app.post("/api/generate", async (req, res) => {
  try {
    const prompt = req.body.prompt;
  } catch (error) {
    console.error(error);
    res.status(200).json({ text: "Failed to generate text" });
  }
});

app.listen(port, () => {
  console.log(`Chatbot backend listening at http://localhost:${port}`);
});
