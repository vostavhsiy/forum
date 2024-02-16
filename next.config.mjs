/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
            hostname:"*"
        }]
    },
    experimental: {
        missingSuspenseWithCSRBailout: false
    }
};

export default nextConfig;
