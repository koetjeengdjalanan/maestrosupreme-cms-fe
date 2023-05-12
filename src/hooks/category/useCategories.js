import { useQuery } from '@tanstack/react-query';
import categoryService from 'services/category/category.service';

export const useCategories = ({ params = {}, options = {} }) => {
    return useQuery({
        queryKey: ['blog-categories', params],
        queryFn: ({ pageParam }) => categoryService.getAll(pageParam ?? params),
        ...options,
    });
};
