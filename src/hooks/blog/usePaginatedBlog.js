import { useQuery } from '@tanstack/react-query';
import blogService from 'services/blog/blog.service';

export const usePaginatedBlog = ({ params = {}, options = {} }) => {
    //   const queryClient = useQueryClient();
    return useQuery({
        queryKey: ['paginated-blog', params],
        queryFn: ({ pageParam }) => blogService.getAll(pageParam ?? params),
        ...options,
    });
};
