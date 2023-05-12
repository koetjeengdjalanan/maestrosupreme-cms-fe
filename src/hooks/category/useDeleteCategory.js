import { useMutation, useQueryClient } from '@tanstack/react-query';
import categoryService from 'services/category/category.service';

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: id => categoryService.deletePermanent(id),
        onSuccess: res => {
            if (res) {
                queryClient.refetchQueries(['blog-categories']);
            }
        },
    });
};
