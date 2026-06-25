const asyncHandler = require('../middlewares/asyncHandler');
const { createNotice } = require('../services/notice.service');
const { getAllStudentPhones } = require('../services/student.service');
const { summarizeText } = require('../services/ai.service');
const { sendNoticeWebhook } = require('../services/webhook.service');
const { sendSuccess } = require('../utils/response');

const createNoticeController = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  // Generate AI summary — fall back gracefully if Groq is unavailable
  let summary = 'Summary unavailable';
  try {
    summary = await summarizeText(content);
  } catch (err) {
    console.error('[NOTICE] AI summarization failed:', err.message);
  }

  const notice = await createNotice({ title, content, summary });

  // Fire-and-forget: broadcast to all students via n8n
  getAllStudentPhones()
    .then((phoneList) => {
      sendNoticeWebhook({
        noticeText: content,
        eventDate:  new Date().toISOString(),
        eventTitle: title,
        phoneList,
      });
    })
    .catch((err) => console.error('[NOTICE] Failed to collect phones for webhook:', err.message));

  return sendSuccess(res, 'Notice created successfully', { summary: notice.summary }, 201);
});

module.exports = { createNoticeController };
