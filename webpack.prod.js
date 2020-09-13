const path = require('path')
const { merge } = require('webpack-merge');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TersetWebpackPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const baseConfig = require('./webpack.common');

const baseDir = process.cwd()

module.exports = merge(baseConfig, {
  mode: 'production',
  devtool: 'none',
  output: {
    path: path.join(baseDir, 'dist'),
    filename: 'scripts/[name].[contenthash:8].js',
    chunkFilename: 'scripts/[name].[contenthash:8].js',
  },
  parallelism: 1, // 限制并行处理模块的数量
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin(),
      new TersetWebpackPlugin({})
    ]
  },
  plugins: [
    new CleanWebpackPlugin()
  ]
})
