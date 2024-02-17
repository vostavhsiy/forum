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
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        config.node = {
            fs: 'empty',
            net: 'empty',
            tls: 'empty'
        }
        return config
    },
    webpackDevMiddleware: config => {
        return config
    },
};

export default nextConfig;
