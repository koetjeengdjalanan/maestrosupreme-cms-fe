/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  // basePath: process.env.NODE_ENV === 'production' ? '/sakai-react' : '',
  publicRuntimeConfig: {
    //   contextPath: process.env.NODE_ENV === 'production' ? '/sakai-react' : '',
    contextPath: '',
    //   uploadPath:
    //       process.env.NODE_ENV === 'production' ? '/sakai-react/upload.php' : '/api/upload',
    uploadPath: '/api/upload',
  },
  images: {
    domains: ['temporary.suaraproduction.com', 'source.unsplash.com'],
  },
};

module.exports = nextConfig;
