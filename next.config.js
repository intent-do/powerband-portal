const api_proxy = process.env.NEXT_PUBLIC_API_AROFLO_ENDPOINT|| 'http://20.213.184.177:3000';;

/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
    experimental: {
        // appDir: true,
    },
    async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: `${api_proxy}:path*`,
      },
    ];
  },
};

module.exports = nextConfig; 