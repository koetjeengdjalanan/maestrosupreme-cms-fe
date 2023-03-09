import { useMutation, useQuery } from '@tanstack/react-query';
import blogService from 'services/blog/blog.service';

export const useEditBlog = () => {
    return useMutation({
        mutationFn: payload => blogService.edit(payload),
    });
};
