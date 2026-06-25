import api from './index';

export const createTask  = (data) => api.post('/task', data);
export const getAllTasks  = ()     => api.get('/tasks');
export const updateTask  = (id, data) => api.put(`/task/${id}`, data);
export const deleteTask  = (id)   => api.delete(`/task/${id}`);
