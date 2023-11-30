const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const deps = require("./package.json").dependencies;
const domain = process.env.DOMAIN_URL;
module.exports = (_, argv) => ({
  output: {
    publicPath: "http://localhost:9000/",
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  devServer: {
    port: 9000,
    historyApiFallback: true,
  },

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "container",
      filename: "remoteEntry.js",
      remotes: {
        auth: `auth@http://${domain ? domain + '/auth/latest/remoteEntry.js' : 'localhost:9002/remoteEntry.js'}`,
        dashboard: `dashboard@http://${domain ? domain + '/dashboard/lastest/remoteEntry.js' : 'localhost:9001/remoteEntry.js'}`,
        product: `product@http://${domain ? domain + '/product/lastest/remoteEntry.js' : 'localhost:9003/remoteEntry.js'}`,
        store: `store@http://localhost:9004/remoteEntry.js`,
      },
      exposes: {
        './Styles': './src/constant/styles.ts',
        './index.scss': './src/index.scss'
      },
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
      },
    }),
    new HtmlWebPackPlugin({
      template: "./public/index.html",
    })
  ],
});
