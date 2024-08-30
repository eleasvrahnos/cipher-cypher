/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const isDev = process.env.NODE_ENV === 'development';
    const backendUrl = isDev
      ? 'http://localhost:5000' // Local development server
      : 'https://ciphercypher-server-6ff695f2e615545b.vercel.app'; // Production server

    return [
      {
        source: '/api/:path*', // Match all API routes
        destination: `${backendUrl}/api/:path*`, // Proxy to the backend server
      },
    ];
  },
};

export default nextConfig;
