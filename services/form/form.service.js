import apiCall from 'services/_baseService';

const formService = {
    async getAll(params) {
        const { data } = await apiCall.get('/admin/form', {
            params,
        });
        return data;
    },
    async create(payload) {
        const { data } = await apiCall.post('/admin/form/store', payload);
        return data;
    },
    async update(payload) {
        const { data } = await apiCall.put('/admin/form/update', payload);
        return data;
    },
};

export default formService;
