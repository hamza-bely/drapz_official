

import { apiClient } from '../api-client';
import { PaysResponse } from '@/types/api';

export const countryService = {
    async getAllCountries(): Promise<PaysResponse[]> {
        const { data } = await apiClient.get('pays');
        return data;
    },

    async getCountryByCode(code: string): Promise<PaysResponse> {
        const { data } = await apiClient.get(`pays/${code}`);
        return data;
    },
};
