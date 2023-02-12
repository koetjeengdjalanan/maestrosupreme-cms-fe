import { getSession } from 'next-auth/react';
import apiCall from '../_baseService';

const userManagementService = {
    async getAll() {
        const { data } = await apiCall.get('/admin/control/users');
        return data;
    },
};

export default userManagementService;
