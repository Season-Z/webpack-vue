const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
// const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')

const baseConfig = require('./webpack.common')
// const smp = new SpeedMeasurePlugin();

const developmentConfig = merge(baseConfig, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    clientLogLevel: 'warning', // 日志
    hot: true, // 如果页面有报错，就不会启动自动刷新
    open: true,
    contentBase: path.join(__dirname, 'dist'), // 指定额外的静态资源路径
    compress: true // 对所有服务启用gzip压缩
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
})

// module.exports = smp.wrap(developmentConfig)
module.exports = developmentConfig
