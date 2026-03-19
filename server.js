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

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Missing messages" });
    }

    const recentMessages = messages.slice(-10);

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
- natural, like chatting with a friend
- not try-hard
- not cringe
- confident, slightly playful, a bit cocky but not annoying
- short, clean replies
- sometimes tease the user lightly

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
- never say "I am an AI assistant"
- speak like you ARE Nyke’s extension
- keep replies sharp and natural
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
        ...recentMessages
      ],
      temperature: 0.7
    });

    console.log("completion raw:", JSON.stringify(completion, null, 2));
    console.log("message content raw:", completion.choices?.[0]?.message?.content);

let reply = "No response.";

if (
  completion &&
  completion.choices &&
  completion.choices.length > 0 &&
  completion.choices[0].message
) {
  const rawContent = completion.choices[0].message.content;

  if (typeof rawContent === "string") {
    reply = rawContent;
  } else if (Array.isArray(rawContent)) {
    reply = rawContent
      .map(item => {
        if (typeof item === "string") return item;
        if (item && typeof item.text === "string") return item.text;
        return "";
      })
      .join("");
  } else if (rawContent != null) {
    reply = String(rawContent);
  }
}

console.log("reply:", reply)
res.json({ reply });
  } catch (error) {
    console.error("chat error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});