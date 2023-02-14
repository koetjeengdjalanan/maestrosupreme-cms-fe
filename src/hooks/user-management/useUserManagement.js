import { useQuery } from '@tanstack/react-query';
import userManagementService from 'services/userManagement/userManagement.serviece';

export const useUserManagement = () => {
    //   const queryClient = useQueryClient();
    return useQuery({
        queryKey: ['user-management'],
        queryFn: userManagementService?.getAll,
    });
};
