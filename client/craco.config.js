const webpack = require("webpack");

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          // Node.js core modules polyfills
          crypto: require.resolve("crypto-browserify"),
          stream: require.resolve("stream-browserify"),
          http: require.resolve("stream-http"),
          https: require.resolve("https-browserify"),
          url: require.resolve("url/"),
          util: require.resolve("util/"),
          zlib: require.resolve("browserify-zlib"),
          querystring: require.resolve("querystring-es3"),
          timers: require.resolve("timers-browserify"),
          os: require.resolve("os-browserify/browser"),
          path: require.resolve("path-browserify"),
          process: require.resolve("process/browser"),
          fs: false,
          net: false,
          tls: false,
          dns: false,
          child_process: false,
          assert: require.resolve("assert/"),
        },
      },
    },
    plugins: {
      add: [
        new webpack.ProvidePlugin({
          process: "process/browser",
          Buffer: ["buffer", "Buffer"],
        }),
      ],
    },
  },
};
