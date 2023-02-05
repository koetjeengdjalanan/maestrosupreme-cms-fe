const { default: apiCall } = require('services/_baseService');

const mainContentService = {
  async getMainContent() {
    return ({ data } = await apiCall.get());
  },
  async updateMainContent(data) {
    return ({ data } = await apiCall.post('/'));
  },
};
