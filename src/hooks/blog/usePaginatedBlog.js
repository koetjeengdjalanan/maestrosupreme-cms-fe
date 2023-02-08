import { useInfiniteQuery } from '@tanstack/react-query';
import blogService from 'services/blog/blog.service';

export const usePaginatedBlog = ({ params = {}, options = {} }) => {
    //   const queryClient = useQueryClient();
    return useInfiniteQuery({
        queryKey: ['paginated-query', params],
        queryFn: ({ pageParam }) => blogService.getAll(pageParam ?? params),
        ...options,
    });
};
