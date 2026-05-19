import api from './api';

export const register = async (payload) => {
  const response = await api.post('/api/auth/register', payload);
  return response.data;
};

export const login = async (payload) => {
  const response = await api.post('/api/auth/login', payload);
  return response.data;
};
