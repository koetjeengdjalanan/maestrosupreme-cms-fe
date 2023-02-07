// import { getSession } from 'next-auth/react';
import apiCall from './_baseService';

const uploadImageService = {
  async upload(payload) {
    let formData = new FormData();
    formData.append('file', payload);
    const data = await apiCall.post('/admin/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
};

export default uploadImageService;
