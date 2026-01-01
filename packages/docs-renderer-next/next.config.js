/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,

  // Transpile design system packages
  transpilePackages: [
    "@ds/docs-core",
    "@ds/docs-content",
    "@ds/wc",
    "@ds/next",
    "@ds/react",
    "@ds/tokens",
    "@ds/css",
  ],

  // Configure MDX support
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],

  // Experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },

  // Webpack customization for MDX
  webpack: (config) => {
    // Ensure proper resolution of workspace packages
    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
    };

    return config;
  },
};

export default nextConfig;
