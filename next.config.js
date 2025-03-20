/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    // Remove static export to allow for dynamic rendering
    // output: 'export', // For Netlify static hosting
    images: {
        unoptimized: true, // For Netlify static deployment
    },
    // For handling submodule if present
    webpack: (config, { isServer }) => {
        // Fix for ESM modules like oauth4webapi used by @auth0/nextjs-auth0
        config.resolve.fallback = {
            ...config.resolve.fallback,
            net: false,
            tls: false,
            fs: false,
            crypto: require.resolve('crypto-browserify')
        };

        // Add transpilePackages for proper ESM handling
        config.experiments = {
            ...config.experiments,
            topLevelAwait: true,
        };

        return config;
    },
    transpilePackages: ['@auth0/nextjs-auth0'],
    // To support deployment on Netlify
    distDir: '.next',
    output: 'standalone',
    experimental: {
        esmExternals: 'loose'
    },
};

module.exports = nextConfig; 