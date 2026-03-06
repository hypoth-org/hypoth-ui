/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,

  // Transpile design system packages
  transpilePackages: [
    "@hypoth-ui/docs-core",
    "@hypoth-ui/docs-content",
    "@hypoth-ui/wc",
    "@hypoth-ui/next",
    "@hypoth-ui/react",
    "@hypoth-ui/tokens",
    "@hypoth-ui/css",
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
