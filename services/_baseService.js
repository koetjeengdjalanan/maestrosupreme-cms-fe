import axios from 'axios';
import { getSession } from 'next-auth/react';

const apiCall = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API ?? 'http://localhost:8000/api',
    // baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

apiCall.interceptors.request.use(
    async (config) => {
        const user = await getSession();
        // console.log(user, 'user');
        if (user?.accessToken) {
            config.headers = {
                Authorization: `Bearer ${user.accessToken}`,
            };
        }

        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);

apiCall.interceptors.response.use(
    function (response) {
        return response.data;
    },
    function (error) {
        console.error(error);
    }
);

export default apiCall;
