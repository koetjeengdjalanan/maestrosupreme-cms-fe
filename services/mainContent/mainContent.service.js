import apiCall from '../_baseService';

const mainContentService = {
  async getMainContent() {
    const { data } = await apiCall.get('/maincontent');
    return data;
  },
  async updateMainContent(payload) {
    const { data } = await apiCall.post('/');
    return data;
  },
};

export default mainContentService;
