import { useMutation, useQueryClient } from '@tanstack/react-query';
import userManagementService from 'services/userManagement/userManagement.serviece';

export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: id => {
            return userManagementService.deleteUser(id);
        },
        onSuccess: () => {
            queryClient.refetchQueries(['user-management']);
        },
    });
};
