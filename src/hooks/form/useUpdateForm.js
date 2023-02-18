import { useMutation } from '@tanstack/react-query';
import formService from 'services/form/form.service';

export const useUpdateForm = () => {
    return useMutation({
        mutationFn: payload => formService.update(payload),
    });
};
