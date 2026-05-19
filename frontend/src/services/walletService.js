import api from './api';

export const getBalance = async () => {
  const response = await api.get('/api/wallet/balance');
  return response.data;
};

export const deposit = async (amount) => {
  const response = await api.post('/api/wallet/deposit', { amount });
  return response.data;
};
