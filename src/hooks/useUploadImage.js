import { useMutation } from '@tanstack/react-query';
import uploadImageService from 'services/uploadImageService';

export const useUploadImage = () => {
  return useMutation({
    mutationFn: file => {
      let formData = new FormData();
      formData.append('file', file);
      return uploadImageService.upload(formData);
    },
  });
};
