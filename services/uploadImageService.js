// import { getSession } from 'next-auth/react';
import { getFormData } from '@/utils/form';
import apiCall from './_baseService';

const uploadImageService = {
  async upload(data) {
    const payload = data instanceof File ? { file: data } : data;
    const formData = getFormData(payload);

    const response = await apiCall.post('/admin/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response?.data) {
      return `https://${response?.data}`;
    }
    return response;
  },
};

export default uploadImageService;
