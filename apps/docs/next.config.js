/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@hypoth-ui/docs-renderer-next",
    "@hypoth-ui/docs-content",
    "@hypoth-ui/docs-core",
    "@hypoth-ui/wc",
    "@hypoth-ui/next",
  ],
};

export default nextConfig;
