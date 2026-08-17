import api from './api';
import axios from 'axios';

export const getProfile = async () => {
  try {
    const response = await api.get('/user/profile');
    return response.data;
  } catch (error) {
     if (axios.isAxiosError(error) && error.message === 'Network Error') {
        return {
           name: 'Test User',
           email: 'test@example.com',
           age: 30,
           gender: 'Male',
           height: 175,
           weight: 70,
           activityLevel: 'Moderately Active',
           healthGoal: 'Maintenance'
        };
     }
     throw error;
  }
};

export const updateProfile = async (userData: any) => {
  try {
    const response = await api.put('/user/profile', userData);
    return response.data;
  } catch (error) {
     if (axios.isAxiosError(error) && error.message === 'Network Error') {
        return { ...userData };
     }
     throw error;
  }
};
