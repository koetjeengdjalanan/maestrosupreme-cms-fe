import apiCall from 'services/_baseService';

const userService = {
    async update(payload) {
        const { data } = await apiCall.put('/admin/auth/update', payload);
        return data;
    },
};

export default userService;
