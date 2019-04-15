const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: process.env.NODE_ENV === 'dev' ? 'development' : 'production',
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            config$: path.resolve(__dirname, 'src/config.js'),
            '@': path.join(__dirname, 'src/components'),
            '#': path.join(__dirname, 'assets')
        }
    },
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name(file) {
                                return process.env.NODE_ENV === 'development' ?
                                    '[path][name].[ext]' :
                                    '[hash].[ext]';
                            },
                            limit: 8192
                        }
                    }
                ]
            },
            {
                test: /\.s?css$/,
                use: [
                    (process.env.NODE_ENV === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader),
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            }
        ]
    },
    plugins: [
        new CopyPlugin([
            {
                from: path.resolve(__dirname, '../protos'),
                to: path.resolve(__dirname, 'dist/protos')
            },
        ]),
        new HtmlWebpackPlugin({
            template: 'index.html'
        }),
        new webpack.HotModuleReplacementPlugin({}),
        new webpack.DefinePlugin({
            API_URL: process.env.NODE_ENV === 'dev' ? "'http://localhost:8080/'" : "'http://localhost:8080/'"
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    ],
    devtool: 'source-map-inline',
    context: path.resolve(__dirname, 'src'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    entry: './index.jsx',
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        port: 3000,
        hot: true
    }
};