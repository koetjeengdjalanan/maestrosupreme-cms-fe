import apiCall from '../_baseService';

const userManagementService = {
    async getAll() {
        const { data } = await apiCall.get('/admin/control/users');
        return data;
    },
    async updateRole({ user_id, role_id }) {
        const { data } = await apiCall.post(
            `/admin/control/roles/assign?user_id=${user_id}&role=${role_id}`
        );
        return data;
    },
    async createUser(payload) {
        const { data } = await apiCall.post(
            `/admin/control/users/create`,
            payload
        );
        return data;
    },
    async updateUser(payload) {
        const { data } = await apiCall.post(
            `/admin/control/users/update`,
            payload
        );
        return data;
    },
    async deleteUser(id) {
        const data = await apiCall.delete(
            `/admin/control/users/delete?user_id=${id}`
        );
        return data;
    },
};

export default userManagementService;
