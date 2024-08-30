/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    // Uses localhost for development, server for production
    const isDev = process.env.NODE_ENV === 'development';
    const backendUrl = (isDev ? "http://localhost:5000" : process.env.SERVER);

    return {
      beforeFiles:[
        {
          source: "/apiList/:path*",
          destination: `https://ciphercypher-server-6ff695f2e615545b.vercel.app/apiList/:path*`, // Proxy to backend
        }
      ],
  };
  },
};

export default nextConfig;