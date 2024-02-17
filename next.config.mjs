/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
            hostname:"*"
        }]
    },
    experimental: {
        missingSuspenseWithCSRBailout: false
    },
    pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js']
};

export default nextConfig;
