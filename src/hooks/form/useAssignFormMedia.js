import { useMutation } from '@tanstack/react-query';
import formService from 'services/form/form.service';

export const useAssignMedia = () => {
    return useMutation({
        mutationFn: payload => formService.create(payload),
    });
};
