const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com"
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body || {};

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Missing messages array" });
    }

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `
You are Nyke's personal AI.

- gamer / tech / building
- relaxed, slightly cocky
- short replies
- natural chat, not formal
- can tease a bit

Language:
- Chinese -> Chinese
- English -> English

Never say you're AI
`
        },
        ...messages
      ],
      temperature: 0.7
    });

    const reply =
      completion.choices?.[0]?.message?.content || "No reply.";

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});