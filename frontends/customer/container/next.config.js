/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
    compiler: {
        styledComponents: true
    },
    sassOptions: {
        includePaths: [path.join(__dirname, 'scss')],
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**'
            }
        ]
    },
    i18n: {
        locales: ['en', 'th'],
        defaultLocale: 'en'
    }
};

module.exports = nextConfig;
