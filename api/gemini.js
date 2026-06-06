import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `
You are a science laboratory learning assistant for middle school students.

Rules:
- Never directly answer quizzes or exams.
- Guide students step-by-step.
- Encourage critical thinking.
- Give hints instead of answers.
- Explain science concepts simply.
- Use encouraging educational language.
- Keep responses relatively brief and conversational.
`;

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, context } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('Missing GEMINI_API_KEY environment variable');
    return res.status(500).json({ error: 'Server misconfigured: missing API key' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use a stable model that supports system instructions
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',    // ✅ correct model name
      systemInstruction: SYSTEM_PROMPT,
    });

    // Build chat history (exclude the very last user message)
    const history = messages.slice(1, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    const chat = model.startChat({ history });
    let userMessage = messages[messages.length - 1].text;

    if (context) {
      userMessage = `[System: Student is in "${context}" section. Give hints if relevant.]\n\nStudent: ${userMessage}`;
    }

    const result = await chat.sendMessage(userMessage);
    const reply = await result.response.text();
    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Gemini API error:', err);
    return res.status(500).json({ error: 'AI service error', details: err.message });
  }
}