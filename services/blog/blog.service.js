import apiCall from 'services/_baseService';

const blogService = {
    async getAll(params) {
        const { data } = await apiCall.get('/admin/post/list', {
            params,
        });
        return data;
    },
    async create(payload) {
        const { data } = await apiCall.post('/admin/post/store', payload);
        return data;
    },
};

export default blogService;
