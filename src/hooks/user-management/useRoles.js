import { useQuery } from '@tanstack/react-query';
import rolesService from 'services/userManagement/roles.service';

export const useRoles = () => {
    //   const queryClient = useQueryClient();
    return useQuery({
        queryKey: ['user-roles'],
        queryFn: rolesService.get,
    });
};
