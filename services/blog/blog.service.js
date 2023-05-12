import apiCall from 'services/_baseService';

const blogService = {
    async getAll(params) {
        const { data } = await apiCall.get('/admin/post/list', {
            params,
        });
        return data;
    },
    async getBySlug(slug) {
        const { data } = await apiCall.get(`/admin/post/show/${slug}`);
        return data;
    },
    async create(payload) {
        const res = await apiCall.post('/admin/post/store', payload);
        if (res?.data) {
            return res.data;
        }
        return res;
    },
    async edit(payload) {
        const { data } = await apiCall.post('/admin/post/edit', payload);
        return data;
    },
    async getCategories(params) {
        const { data } = await apiCall.get('/admin/categories', {
            params,
        });
        return data;
    },
    async deletePermanent(id) {
        const data = await apiCall.delete(`/admin/post/delete?post_id=${id}`);
        return data;
    },
};

export default blogService;
