const axios = require('axios');

const sendDeadlineWebhook = async ({ studentName, phone, email, title, description, deadline, calendar }) => {
  const url = process.env.N8N_DEADLINE_WEBHOOK;
  console.log('[WEBHOOK] sendDeadlineWebhook called — URL:', url);

  if (!url) {
    console.warn('[WEBHOOK] N8N_DEADLINE_WEBHOOK is not set — skipping deadline webhook.');
    return;
  }

  const payload = { studentName, phone, email, title, description, deadline, calendar };
  console.log('[WEBHOOK] Sending payload:', JSON.stringify(payload));

  try {
    const res = await axios.post(url, payload);
    console.log('[WEBHOOK] Deadline webhook delivered — status:', res.status);
  } catch (err) {
    console.error('[WEBHOOK] Failed to deliver deadline webhook:', err.message);
    if (err.response) {
      console.error('[WEBHOOK] Response status:', err.response.status, '| data:', JSON.stringify(err.response.data));
    }
  }
};

const sendNoticeWebhook = async ({ noticeText, eventDate, eventTitle, phoneList }) => {
  if (!NOTICE_WEBHOOK_URL) {
    console.warn('[WEBHOOK] N8N_NOTICE_WEBHOOK is not set — skipping notice webhook.');
    return;
  }

  try {
    await axios.post(NOTICE_WEBHOOK_URL, {
      noticeText,
      eventDate,
      eventTitle,
      phoneList,
    });
    console.log('[WEBHOOK] Notice webhook delivered successfully.');
  } catch (err) {
    console.error('[WEBHOOK] Failed to deliver notice webhook:', err.message);
  }
};

module.exports = { sendDeadlineWebhook, sendNoticeWebhook };
