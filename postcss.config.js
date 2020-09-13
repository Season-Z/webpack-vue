module.exports = {
  options: {
    sourceMap: process.env.NODE_ENV === 'development'
  },
  plugins: [
    require('postcss-import')
  ]
}