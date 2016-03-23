'use strict';

module.exports = {
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: ['es2015'],
          plugins: ["add-module-exports"]
        }
      }
    ]
  },
  output: {
    library: 'Guard',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['', '.js']
  }
};