/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8005',
                pathname: '/files/**',
            },
            {
                protocol: 'https',
                hostname: 'db.api.qual.su',
                port: '8005',
                pathname: '/files/**',
            },
        ]
    }
};

export default nextConfig;
