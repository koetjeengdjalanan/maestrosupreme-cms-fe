import apiCall from '../_baseService';

const rolesService = {
    async get() {
        const { data } = await apiCall.get('/admin/control/roles');
        const roles = data?.map(v => ({
            name: v.name,
            value: v.id,
        }));
        return roles;
    },
};

export default rolesService;
