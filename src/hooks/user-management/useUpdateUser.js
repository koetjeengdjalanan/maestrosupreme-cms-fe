import { useMutation, useQueryClient } from '@tanstack/react-query';
import userManagementService from 'services/userManagement/userManagement.serviece';

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: payload => {
            return userManagementService.updateUser(payload);
        },
        onSuccess: () => {
            queryClient.refetchQueries(['user-management']);
        },
    });
};
