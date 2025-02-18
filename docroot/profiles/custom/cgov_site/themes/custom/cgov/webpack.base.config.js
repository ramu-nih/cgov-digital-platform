const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

const config = {
  target: "web",
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "dist/js")
  },
  externals: {
    jquery: "jQuery",
    jQuery: "jQuery",
    "jquery-ui": "jQuery.ui",
    CDEConfig: "CDEConfig"
  },
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: ["babel-loader"]
      },
      {
        test: /\.s?css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: "css-loader",
            options: {
              url: (uri, resourcePath) => {
                // Ignore absolute paths.
                if (uri.startsWith('/')) {
                  return false;
                }

                return true;
              }
            }
          },
          "postcss-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "../images/sprites",
              name: "[name].[ext]?v=[hash]",
              emitFile: false,
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "../css/[name].css"
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "static/js")
        }
      ]
    })
  ],
  watchOptions: {
    aggregateTimeout: 1000,
    poll: 300,
    ignored: [/node_modules/, /dist/, /sprites/]
  }
};

module.exports = config;
