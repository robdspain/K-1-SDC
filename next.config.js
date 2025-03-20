/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Remove static export to allow for dynamic rendering
    // output: 'export', // For Netlify static hosting
    images: {
        unoptimized: true, // For Netlify static deployment
    },
    // For handling submodule if present
    webpack: (config, { isServer }) => {
        // Fixes npm packages that depend on `fs` module
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
            };
        }
        return config;
    },
};

module.exports = nextConfig; 