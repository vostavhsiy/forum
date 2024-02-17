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
            config.node = {
                fs: 'empty'
            }
        }
        return config
    }
};

export default nextConfig;
