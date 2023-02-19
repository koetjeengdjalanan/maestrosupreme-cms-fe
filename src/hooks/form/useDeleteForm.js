import { useMutation, useQueryClient } from '@tanstack/react-query';
import formService from 'services/form/form.service';

export const useDeleteForm = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: id => formService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['paginated-form']);
        },
    });
};
