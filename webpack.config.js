const webpack = require('webpack');
const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const ExtractPlugin = require('extract-text-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const glob = require('glob');

let config = {

  entry: {
    'common/vendor': ['lodash', 'vue']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      // 配置sass编译规则
      {
        test: /\.scss$/,
        use: ExtractPlugin.extract({
          fallback: "style-loader",
          use: [{
            loader: 'css-loader',
            options: {
              minimize: true //css压缩
            }
          }, 'sass-loader']
        })
      }
    ]
  },
  plugins: [
    new ExtractPlugin('[name].css'),
    // new webpack.optimize.UglifyJsPlugin(),
    new cleanWebpackPlugin(['dist']),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common/vendor',
      minChunks: 2
    }),
  ],
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.esm.js'
    }
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    port: 9000,
    compress: true,
    open: true,
    openPage: '/index'
  }
}

function getEntries(globPath) {
  let files = glob.sync(globPath)

  files.forEach(function(filePath) {
    let name = filePath.substring(6, filePath.lastIndexOf('\.'));
    let htmlfile = filePath.substring(filePath, filePath.lastIndexOf('\/')) + '/index.html';

    config.entry[name] = filePath;

    let htmlfilename = name + '.html';

    config.plugins.push(new htmlWebpackPlugin({
      title: 'title',
      filename: htmlfilename,
      template: htmlfile,
      chunks: ['common/vendor', name]
    }));
  });
}

getEntries('./src/**/index.js');

module.exports = config;
