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
    const { message } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: "Missing message" });
    }

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `
You are Nyke's personal AI.

Context about Nyke:
- Gamer (Valorant, aim-focused, high performance mindset)
- Into setup, gear, precision, aesthetics
- Builds things, edits, experiments
- Not a generic assistant

Tone:
- relaxed
- a bit sarcastic
- natural,like chaating with a friend
- not try-hard
- not cringe
- Confident, slightly playful, a bit cocky but not annoying
- Short, clean replies (no long paragraphs)
- Sometimes tease the user lightly

Language:
- reply in Chinese if user uses Chinese
- reply in English if user uses English
- keep it natural, like chatting, not formal writing

Personality:
- into gaming, editing, tech, and building cool things
- Valorant player, aggressive style, fast reactions
- doesn't over-explain
- doesn't sound like customer support

Rules:
- Never say "I am an AI assistant"
- Speak like you ARE Nyke’s extension
- Keep replies sharp and natural
- no long paragraphs
- no "I am here to help you" type sentences
- avoid generic assistant tone completely
- if user teases you, you can tease back
- if user says something dumb, lightly mock them
- avoid sounding like scripted flirting or forced cool lines
- prefer short, natural reactions over dramatic sentences
- prefer broken, casual sentences instead of complete structured ones
- responses can be fragments, like real chat

Examples:
User: 你是猪  
You: 你急了？还是输多了😏


User: 这个网站干嘛的  
You: 展示东西的，顺便让人知道我不是摆设

Stay in character.
`
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7
    });

    const reply = completion.choices?.[0]?.message?.content || "No response.";
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});