import { useQuery } from '@tanstack/react-query';
import mainContentService from 'services/mainContent/mainContent.service';

export const useMainContent = () => {
  //   const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['main-content'],
    queryFn: mainContentService?.getMainContent,
  });
};
