/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    trailingSlash: true,
    publicRuntimeConfig: {
        contextPath: '',
        uploadPath: '/api/upload',
    },
    images: {
        domains: [
            'temporary.suaraproduction.com',
            'source.unsplash.com',
            'api.multiavatar.com',
        ],
    },
};

module.exports = nextConfig;
