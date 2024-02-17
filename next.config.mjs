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
    webpack: (config, { isServer }) => {

        if (!isServer) {
            config.resolve.fallback = {
                fs: false,
            };
        }

        return config;
    },
};

export default nextConfig;
