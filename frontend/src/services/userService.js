import api from './api';

export const searchUsers = async (email) => {
  const response = await api.get('/api/users/search', { params: { email } });
  return response.data.users;
};
