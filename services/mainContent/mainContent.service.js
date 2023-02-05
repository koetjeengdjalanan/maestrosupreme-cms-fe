import { getSession } from 'next-auth/react';
import apiCall from '../_baseService';

const mainContentService = {
  async getMainContent() {
    const { data } = await apiCall.get('/maincontent');
    return data;
  },
  async updateMainContent(payload) {
    const { user } = await getSession();
    console.log(user?.id);
    const newPayload = {
      ...payload,
      id: user?.id,
    };
    const { data } = await apiCall.post(
      `/admin/maincontent/update`,
      newPayload
    );
    return data;
  },
};

export default mainContentService;
