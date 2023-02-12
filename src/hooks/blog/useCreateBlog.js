import { useMutation, useQuery } from '@tanstack/react-query';
import blogService from 'services/blog/blog.service';

export const useCreateBlog = () => {
    return useMutation({
        mutationFn: payload => blogService.create(payload),
    });
};
