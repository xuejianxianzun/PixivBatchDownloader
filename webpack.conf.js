const path = require('path')

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    content: './src/ts/content.ts',
    background: './src/ts/background.ts',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/js'),
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
