/** @type {import('next').NextConfig} */
// All /api/* calls (Better Auth + REST API) are proxied to the Express server.
// This keeps auth cookies first-party (no CORS / third-party cookie problems in production).
const SERVER_URL = (process.env.SERVER_URL || "http://localhost:5000").replace(/\/+$/, "");

const nextConfig = {
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${SERVER_URL}/api/:path*` }];
  },
};
export default nextConfig;
