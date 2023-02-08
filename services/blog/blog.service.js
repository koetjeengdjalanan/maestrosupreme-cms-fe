import { getSession } from 'next-auth/react';
import apiCall from '../_baseService';

const blogService = {
    async getPaginated(params) {
        console.log(params);
        const data = await apiCall.get(`/admin/post/list`, {
            params,
        });
        return data;
    },
};

export default blogService;
