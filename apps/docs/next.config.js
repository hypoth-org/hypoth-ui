/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@ds/docs-renderer-next",
    "@ds/docs-content",
    "@ds/docs-core",
    "@ds/wc",
    "@ds/next",
  ],
};

export default nextConfig;
