const groqClient = require('../config/groqClient');

const MODEL = 'llama-3.3-70b-versatile';

const parseJSON = (raw, label) => {
  const cleaned = raw.replace(/```json|```/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error(`AI returned invalid JSON for ${label}. Try again.`);
  }
};

// ── Single-turn helper ────────────────────────────────────
const chat = async (systemPrompt, userContent) => {
  const response = await groqClient.post('/chat/completions', {
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: userContent },
    ],
    temperature: 0.5,
  });
  return response.data.choices[0].message.content.trim();
};

// ── Multi-turn chat ───────────────────────────────────────
const chatWithAI = async (messages) => {
  const system = `You are CampusAI, a friendly AI assistant embedded in CampusFlow — a student productivity platform for B.Tech students.
You expertly help with:
• Study concepts, algorithms, programming, formulas, and theory
• Academic research, paper summaries, and topic explanations
• CampusFlow features: tasks, deadlines, notices, flashcards, placement tracking
Keep responses concise (under 200 words) unless the student asks for detail.
Use simple language, short paragraphs, and examples. Be warm and encouraging.`;

  const response = await groqClient.post('/chat/completions', {
    model: MODEL,
    messages: [{ role: 'system', content: system }, ...messages],
    temperature: 0.7,
    max_tokens: 600,
  });
  return response.data.choices[0].message.content.trim();
};

// ── Notice summarizer ─────────────────────────────────────
const summarizeText = async (text) => {
  const system = `You are a helpful assistant for college students.
Summarize the given notice in exactly 3 concise bullet points.
Return only the bullet points, each starting with "• ". No preamble, no closing line.`;
  return await chat(system, text);
};

// ── Flashcard generator ───────────────────────────────────
const generateFlashcards = async (notes) => {
  const system = `You are a study assistant for college students.
Generate flashcards from the given lecture notes.
Return ONLY a valid JSON array. Each element must have exactly two fields: "question" and "answer".
No explanation, no markdown, no extra text — just the raw JSON array.`;
  const raw = await chat(system, notes);
  return parseJSON(raw, 'flashcards');
};

// ── Mock test generator ───────────────────────────────────
const generateMockTest = async ({ role, company, difficulty, count }) => {
  const n = Number(count) || 5;

  const response = await groqClient.post('/chat/completions', {
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: `You are a senior technical interviewer at ${company}. Return ONLY valid JSON — no extra text.`,
      },
      {
        role: 'user',
        content: `Generate exactly ${n} ${difficulty}-level MCQ questions for a ${role} interview at ${company}.
Cover: DSA, ${role}-specific skills, system design, and one aptitude question.
Return a JSON object with this exact structure:
{
  "questions": [
    {
      "question": "question text",
      "options": ["option A", "option B", "option C", "option D"],
      "correct": 0,
      "explanation": "one sentence why correct answer is right"
    }
  ]
}
- options must be an array of exactly 4 strings (no A/B/C/D labels)
- correct is the 0-based index of the right option`,
      },
    ],
    temperature: 0.3,
    max_tokens: 4000,
    response_format: { type: 'json_object' },
  });

  const raw = response.data.choices[0].message.content.trim();

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('AI returned invalid JSON for mock test. Try again.');
  }

  const questions = parsed.questions || parsed;
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error('AI returned no questions. Try again.');
  }

  return questions;
};

// ── AI weekly prep plan ───────────────────────────────────
const generatePrepPlan = async ({ role, company, roundsCleared, daysLeft }) => {
  const system = `You are a placement coach for engineering students.
Create a ${daysLeft}-day study plan for a student preparing for ${role} role at ${company}.
They have cleared: ${roundsCleared || 'no rounds yet'}.
Return a practical, day-wise plan in plain text with clear structure. Use bullet points per day. Be specific — name actual topics, not vague suggestions. Max 300 words.`;
  return await chat(system, `Create prep plan for ${role} at ${company}`);
};

module.exports = {
  summarizeText,
  generateFlashcards,
  chatWithAI,
  generateMockTest,
  generatePrepPlan,
};
