import api from './index';

export const createNotice = (data) => api.post('/notice', data);
