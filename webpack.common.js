const os = require('os')
const path = require('path')
const webpack = require('webpack')
const HappyPack = require('happypack')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const WebpackBar = require('webpackbar')

const baseDir = process.cwd()
const isDev = process.env.NODE_ENV === 'development'

// 开辟一个线程池
// 拿到系统CPU的最大核数，happypack 将编译工作灌满所有线程
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.join(baseDir, 'dist'),
    filename: 'scripts/[name].[hash:8].js'
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.(le|c)ss$/,
        use: [
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: '.tmp/css-loader'
            }
          },
          isDev ? { loader: 'style-loader' } : MiniCSSExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { sourceMap: isDev, modules: false, importLoaders: 1 }
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: isDev
            }
          }
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'happypack/loader?id=js'
      },
      {
        test: /\.(png|jp(e)?g|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 10 * 1024,
          esModule: false,
          name: 'img/[name].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10 * 1024,
            name: 'fonts/[name].[ext]'
          }
        }
      }
    ]
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendors: {
          chunks: 'initial',
          name: 'vendors',
          priority: 10,
          enforce: true
        },
        default: {
          chunks: 'initial',
          minChunks: 2,
          name: 'commons'
        }
      }
    }
  },
  resolve: {
    extensions: ['jsx', 'js'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    new VueLoaderPlugin(),
    new WebpackBar(),
    new HappyPack({
      id: 'js',
      threadPool: happyThreadPool,
      loaders: [
        {
          loader: 'babel-loader',
          options: {
            cacheDirectory: '.tmp/babel-loader',
            presets: [
              '@babel/preset-env'
            ]
          }
        }
      ]
    }),
    new MiniCSSExtractPlugin({
      filename: 'style/[name].[hash:8].css',
      chunkFilename: 'style/[name].[hash:8].css' // 未被列在entry中，却又需要被打包出来的文件命名配置。按需加载时
    }),
    new HtmlWebpackPlugin({
      title: 'hello world',
      template: path.join(baseDir, 'public/index.html')
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: 'public', to: './' }]
    }),
    new webpack.DefinePlugin({
      // 值要求的是一个代码片段
      BASE_URL: JSON.stringify('./')
    })
  ]
}
