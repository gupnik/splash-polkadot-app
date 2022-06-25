const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

module.exports = function override(config, env) {
  config.resolve = {
    extensions: [".js", ".ts", ".jsx", ".tsx"],
    fallback: {
      stream: require.resolve('stream-browserify'),
      fs: false
    },
  }
  config.plugins.push(new NodePolyfillPlugin())
  return config
}
