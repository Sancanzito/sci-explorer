import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `You are a science laboratory learning assistant...`; // same as in Ai.jsx

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, context } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server misconfigured: missing API key' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      systemInstruction: SYSTEM_PROMPT
    });

    const history = messages.slice(1, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const chat = model.startChat({ history });
    let userMessage = messages[messages.length - 1].text;
    if (context) {
      userMessage = `[System: Student is in "${context}" section. Give hints if relevant.]\n\nStudent: ${userMessage}`;
    }

    const result = await chat.sendMessage(userMessage);
    const reply = await result.response.text();
    res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI service error' });
  }
}