import api from './api';

export const loginUser = async (credentials) => {
  const { data } = await api.post('/User/Login', credentials);
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  localStorage.setItem('userId', data.id); // store user ID securely
  return data;
};

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  const email = localStorage.getItem('email');
  if (!refreshToken || !email) return null;

  try {
    const { data } = await api.post('/User/Refresh-Token', { email, refreshToken });
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  } catch {
    return null;
  }
};

export const logoutUser = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  const email = localStorage.getItem('email');
  if (!refreshToken || !email) return;

  await api.post('/User/Logout', { email, refreshToken });
  localStorage.clear();
};
