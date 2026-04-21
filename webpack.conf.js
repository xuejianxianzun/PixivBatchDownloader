const path = require('path')

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    content: './src/ts/content.ts',
    injectScript: './src/ts/injectScript.ts',
    background: './src/ts/serviceWorker/background.ts',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist-special-HongYe/js'),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
}
