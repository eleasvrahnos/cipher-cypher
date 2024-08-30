module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://ciphercypher-server-6ff695f2e615545b.vercel.app/api/:path*"
      },
    ]
  },
};