import axios from 'axios';
import { getToken } from '../utils/auth';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export const login = (email: string, password: string) => api.post('/user/login', { email, password });
export const register = (username: string, email: string, password: string) => api.post('/user/register', { username, email, password });

export const getPolls = () => api.get('/polls');
export const createPoll = (pollData: { question: string; options: string[] }) => api.post('/polls', pollData);
export const votePoll = (pollId: string, optionIndex: number) => api.post(`/polls/${pollId}/vote`, { optionIndex });
export const getUserPolls = () => api.get('/polls/user'); // New function to get user polls


export const getChatMessages = () => api.get('/chat/messages');

export default api;