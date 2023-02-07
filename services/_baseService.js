import axios from 'axios';
const baseURL =
  process.env.NEXT_PUBLIC_BACKEND_API ?? 'http://localhost:8000/api';

const publicService = axios.create({ baseURL });

publicService.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    console.error(error);
  }
);

const apiCall = axios.create({
  baseURL: baseURL,
  // baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiCall.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    console.error(error);
  }
);

export const setToken = token => {
  apiCall.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export { publicService };

export default apiCall;
