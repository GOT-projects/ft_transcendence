const path = require('path');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
         test: /\.tsx?$/,
         loader: 'esbuild-loader',
         options: {
           loader: 'tsx',  // Or 'ts' if you don't need tsx
           target: 'es2015'
         }
       },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
