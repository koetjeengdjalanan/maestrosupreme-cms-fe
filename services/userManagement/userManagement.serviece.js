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
};

export default userManagementService;
