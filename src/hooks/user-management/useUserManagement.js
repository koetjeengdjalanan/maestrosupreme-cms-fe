import { useQuery } from '@tanstack/react-query';
import userManagementService from 'services/userManagement/userManagement.serviece';

export const useUserManagement = () => {
    return useQuery({
        queryKey: ['user-management'],
        queryFn: userManagementService?.getAll,
    });
};
