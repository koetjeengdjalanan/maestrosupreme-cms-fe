import { getFormData } from '@/utils/form';
import { useMutation } from '@tanstack/react-query';
import uploadImageService from 'services/uploadImageService';

export const useUploadImage = () => {
  return useMutation({
    mutationFn: data => {
      return uploadImageService.upload(data);
    },
  });
};
