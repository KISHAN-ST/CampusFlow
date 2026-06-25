import api from './index';

export const registerStudent = (data) => api.post('/student', data);
export const getStudent      = (id)   => api.get(`/student/${id}`);
export const getAllStudents   = ()     => api.get('/students');
