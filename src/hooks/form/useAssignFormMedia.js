import { useMutation, useQueryClient } from '@tanstack/react-query';
import formService from 'services/form/form.service';

export const useAssignMedia = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: payload => formService.assignMedia(payload),
        onSuccess: () => queryClient.invalidateQueries(['paginated-form']),
    });
};
