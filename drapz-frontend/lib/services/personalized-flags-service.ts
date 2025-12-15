import { apiClient } from '../api-client';
import { PersonalizedFlag } from '../../types/api';

export const getPersonalizedFlags = async (name?: string): Promise<PersonalizedFlag[]> => {
    const params = name ? { name } : {};
    const response = await apiClient.get('/personalized-flags', { params });
    return response.data;
};
