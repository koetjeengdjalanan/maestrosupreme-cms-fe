import { useMutation } from '@tanstack/react-query';
import mainContentService from 'services/mainContent/mainContent.service';

export const useUpdateMainContent = () =>
  useMutation({
    mutationFn: newContent => {
      return mainContentService.updateMainContent(newContent);
    },
  });
