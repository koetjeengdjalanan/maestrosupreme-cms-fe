import { useMutation, useQueryClient } from '@tanstack/react-query';
import userManagementService from 'services/userManagement/userManagement.serviece';

export const useUpdateRoles = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: payload => {
            return userManagementService.updateRole(payload);
        },
        onSuccess: () => {
            queryClient.refetchQueries(['user-management']);
        },
    });
};
