export default {
  plugins: {
    "postcss-import": {},
    cssnano: {
      preset: [
        "default",
        {
          discardComments: { removeAll: true },
          normalizeWhitespace: true,
        },
      ],
    },
  },
};
