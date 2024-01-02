const express = require("express");
const { createRenderContext } = require("ai-jsx");
const cors = require("cors");
const app = express();
const port = 8000;

const renderContext = createRenderContext({
  // Specify your engine and options here
  engine: "openai", // or any other supported engine
  options: {
    apiKey: "YOUR_OPENAI_API_KEY", // if using OpenAI models
  },
});

// Enable CORS
app.use(cors());

// Define an API endpoint
app.post("/chat", async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const response = await renderContext.render(prompt);
    res.json({ text: response });
  } catch (error) {
    console.error(error);
    res.status(200).json({ text: "Failed to generate text" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
