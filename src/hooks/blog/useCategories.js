import { useQuery } from '@tanstack/react-query';
import blogService from 'services/blog/blog.service';

export const useCategories = ({ params = {}, options = {} }) => {
    return useQuery({
        queryKey: ['blog-categories', params],
        queryFn: ({ pageParam }) =>
            blogService.getCategories(pageParam ?? params),
        ...options,
    });
};
