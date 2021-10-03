const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {

    entry: "./src/example/index.tsx",

    output: {
        publicPath: "/",
        filename: 'index.js'
    },

    devServer: {
        port: 3000,
    },

    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        alias: {
            src: path.resolve(__dirname, "src"),
            lib: path.resolve(__dirname, "src/lib"),
            example: path.resolve(__dirname, "src/example"),
        }
    },

    module: {
        rules: [
            {
                test: /\.(jsx|js)?$/,
                loader: "babel-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.tsx?$/,
                loader: "babel-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
              }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: "./src/example/index.html",
        }),
        new MiniCssExtractPlugin({
            filename: 'index.css',
        })
    ],

    devtool: process.env.NODE_ENV === "production" ? false : "eval-source-map",
};

