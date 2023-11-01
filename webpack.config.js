module.exports = {
  target: 'node',
  resolve: {
    fallback: {
      fs: require.resolve('fs'),
      tls: false,
      net: false,
      path: require.resolve("path-browserify"),
      zlib: require.resolve("browserify-zlib"),
      http: false,
      https: false,
      stream: false,
      crypto: require.resolve("crypto-browserify"),
      "crypto-browserify": require.resolve("crypto-browserify"), //if you want to use this module also don't forget npm i crypto-browserify
    },
  },
};
