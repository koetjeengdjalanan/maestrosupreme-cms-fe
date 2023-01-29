import axios from 'axios';

const apiCall = axios.create({
    baseURL: process.env.BACKEND_API ?? 'http://localhost',
    headers: {
        'Content-Type': 'application/json',
    },
});

apiCall.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
    return config;
});

apiCall.interceptors.response.use(
    function (response) {
        return response.data;
    },
    function (error) {
        console.error(error);
    }
);

export default apiCall;
