/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    // Uses localhost for development, server for production
    const isDev = process.env.NODE_ENV === 'development';
    const backendUrl = (isDev ? "http://localhost:5000" : process.env.SERVER);

    return [
      {
        source: "/apiList/:path*",
        destination: `${backendUrl}/apiList/:path*`, // Proxy to backend
      },
    ];
  },
};

export default nextConfig;