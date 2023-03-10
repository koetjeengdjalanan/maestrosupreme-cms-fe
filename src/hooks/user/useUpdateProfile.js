import { useMutation } from '@tanstack/react-query';
import userService from 'services/user/user.service';

export const useUpdateUser = () => {
    return useMutation({
        mutationFn: payload => userService.update(payload),
    });
};
