var path = require('path');
// require('babel-core/register');
var webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, '../dist/'),
        filename: 'index.bundle.js'
    },
    module: {
        rules: [
            {
                test: /.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
    target: "node"
};