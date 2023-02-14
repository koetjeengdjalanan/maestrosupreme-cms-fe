import { useMutation, useQueryClient } from '@tanstack/react-query';
import userManagementService from 'services/userManagement/userManagement.serviece';

export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: payload => {
            return userManagementService.createUser(payload);
        },
        onSuccess: () => {
            queryClient.refetchQueries(['user-management']);
        },
    });
};
