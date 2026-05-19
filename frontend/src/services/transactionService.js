import api from './api';

export const transfer = async (payload, idempotencyKey) => {
  const config = idempotencyKey
    ? { headers: { 'Idempotency-Key': idempotencyKey } }
    : undefined;

  const response = await api.post('/api/transactions/transfer', payload, config);
  return response.data;
};

export const getHistory = async () => {
  const response = await api.get('/api/transactions/history');
  return response.data;
};
