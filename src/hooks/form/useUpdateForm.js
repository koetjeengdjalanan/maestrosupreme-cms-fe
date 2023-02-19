import { useMutation, useQueryClient } from '@tanstack/react-query';
import formService from 'services/form/form.service';

export const useUpdateForm = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: payload => formService.update(payload),
        onSuccess: () => queryClient.invalidateQueries(['paginated-form']),
    });
};
