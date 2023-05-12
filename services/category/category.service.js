import apiCall from 'services/_baseService';

const categoryService = {
    async getAll(params) {
        const { data } = await apiCall.get('/admin/categories', {
            params,
        });
        return data;
    },
    // async getBySlug(slug) {
    //     const { data } = await apiCall.get(`/admin/post/show/${slug}`);
    //     return data;
    // },
    async create(payload) {
        const res = await apiCall.post('/admin/categories/store', payload);
        if (res?.data) {
            return res.data;
        }
        return res;
    },
    // async edit(payload) {
    //     const { data } = await apiCall.post('/admin/post/edit', payload);
    //     return data;
    // },
    async deletePermanent(id) {
        const data = await apiCall.delete(`/admin/categories/delete?id=${id}`);
        return data;
    },
};

export default categoryService;
