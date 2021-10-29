const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'development',
  entry: "./src/index.js",
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '../dist'),
    clean: true // xoa di nhung file thua
  },
  watch: true,// đây là watch mode
  devServer: {
    contentBase: path.join(__dirname, '../dist'),
    hot: true,
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.css']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/template.html",
      title: 'custom template',
      inject: true
    }),


  ]
  ,
  module: {
    rules: [
      {
        test: /\.js|\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css|\.scss?$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpg|png|woff|woff2|eot|ttf|svg)$/,
        use: 'file-loader?limit=100000',
      },
    ],
  },
}