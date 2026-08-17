import api from '../api/axios';
import axios from 'axios';

export const login = async (credentials: any) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.message === 'Network Error') {
        console.warn('Backend unavailable, mocking login response');
        return {
            token: 'mock-jwt-token-12345',
            user: {
                id: '1',
                email: credentials.email,
                name: 'Test User',
                age: 30,
                gender: 'Male',
                height: 175,
                weight: 70,
                activityLevel: 'Moderately Active',
                healthGoal: 'Maintenance'
            }
        };
    }
    throw error;
  }
};

export const register = async (userData: any) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
      if (axios.isAxiosError(error) && error.message === 'Network Error') {
         console.warn('Backend unavailable, mocking register response');
         return {
            token: 'mock-jwt-token-12345',
            user: { id: '1', ...userData }
         };
      }
      throw error;
  }
};

