import apiCall from 'services/_baseService';

const blogService = {
    async getAll(params) {
        const { data } = await apiCall.get('/admin/post/list', {
            params,
        });
        return data;
    },
};

export default blogService;
