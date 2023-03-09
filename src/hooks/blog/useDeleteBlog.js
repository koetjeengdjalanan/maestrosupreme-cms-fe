import { useMutation, useQueryClient } from '@tanstack/react-query';
import blogService from 'services/blog/blog.service';

export const useDeleteBlog = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: id => blogService.deletePermanent(id),
        onSuccess: res => {
            if (res) {
                queryClient.refetchQueries(['paginated-blog']);
            }
        },
    });
};
