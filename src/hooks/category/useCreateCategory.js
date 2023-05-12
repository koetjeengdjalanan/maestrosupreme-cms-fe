import { useMutation, useQueryClient } from '@tanstack/react-query';
import categoryService from 'services/category/category.service';

export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: payload => categoryService.create(payload),
        onSuccess: res => {
            if (res) {
                queryClient.refetchQueries(['blog-categories']);
            }
        },
    });
};
