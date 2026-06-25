import api from './index';

export const summarize    = (text)    => api.post('/ai/summarize',  { text });
export const flashcards   = (notes)   => api.post('/ai/flashcards', { notes });
export const chatWithAI   = (messages) => api.post('/ai/chat',      { messages });
export const mockTest     = (payload) => api.post('/ai/mock-test',  payload);
export const prepPlan     = (payload) => api.post('/ai/prep-plan',  payload);
