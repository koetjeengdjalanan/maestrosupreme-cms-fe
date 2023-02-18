import { useMutation } from '@tanstack/react-query';
import formService from 'services/form/form.service';

export const useCreateForm = () => {
    return useMutation({
        mutationFn: payload => formService.create(payload),
    });
};
