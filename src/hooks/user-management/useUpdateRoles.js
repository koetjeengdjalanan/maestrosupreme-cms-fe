import { useMutation } from '@tanstack/react-query';
import userManagementService from 'services/userManagement/userManagement.serviece';

export const useUpdateRoles = () =>
    useMutation({
        mutationFn: payload => {
            return userManagementService.updateRole(payload);
        },
    });
