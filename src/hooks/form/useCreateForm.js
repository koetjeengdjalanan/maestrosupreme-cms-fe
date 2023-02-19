import { useMutation, useQueryClient } from '@tanstack/react-query';
import formService from 'services/form/form.service';

export const useCreateForm = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: payload => formService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries(['paginated-form']);
        },
    });
};
