import { useQuery } from '@tanstack/react-query';
import blogService from 'services/blog/blog.service';

export const useBlogBySlug = ({ slug, options = {} }) => {
    //   const queryClient = useQueryClient();
    return useQuery({
        queryKey: ['blog-by-slug', slug],
        queryFn: () => blogService.getBySlug(slug),
        enabled: !!slug,
        ...options,
    });
};
