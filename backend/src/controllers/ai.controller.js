const asyncHandler = require('../middlewares/asyncHandler');
const {
  summarizeText,
  generateFlashcards,
  chatWithAI,
  generateMockTest,
  generatePrepPlan,
} = require('../services/ai.service');
const { sendSuccess, sendError } = require('../utils/response');

const summarize = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text) return sendError(res, 'text is required', 422);
  const summary = await summarizeText(text);
  return sendSuccess(res, 'Summary generated successfully', { summary });
});

const flashcards = asyncHandler(async (req, res) => {
  const { notes } = req.body;
  if (!notes) return sendError(res, 'notes is required', 422);
  const cards = await generateFlashcards(notes);
  return sendSuccess(res, 'Flashcards generated successfully', { flashcards: cards });
});

const chat = asyncHandler(async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return sendError(res, 'messages array is required', 422);
  }
  const reply = await chatWithAI(messages);
  return sendSuccess(res, 'Response generated', { reply });
});

const mockTest = asyncHandler(async (req, res) => {
  const { role, company, difficulty = 'medium', count = 5 } = req.body;
  if (!role || !company) return sendError(res, 'role and company are required', 422);
  const questions = await generateMockTest({ role, company, difficulty, count: Number(count) });
  return sendSuccess(res, 'Mock test generated', { questions });
});

const prepPlan = asyncHandler(async (req, res) => {
  const { role, company, roundsCleared, daysLeft = 14 } = req.body;
  if (!role || !company) return sendError(res, 'role and company are required', 422);
  const plan = await generatePrepPlan({ role, company, roundsCleared, daysLeft: Number(daysLeft) });
  return sendSuccess(res, 'Prep plan generated', { plan });
});

module.exports = { summarize, flashcards, chat, mockTest, prepPlan };
