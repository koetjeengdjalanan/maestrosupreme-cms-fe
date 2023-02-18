import { useQuery } from '@tanstack/react-query';
import formService from 'services/form/form.service';

export const usePaginatedForm = ({ params = {}, options = {} }) => {
    return useQuery({
        queryKey: ['paginated-query', params],
        queryFn: ({ pageParam }) => formService.getAll(pageParam ?? params),
        ...options,
    });
};
