const webpack = require('webpack')
const path = require('path')

module.exports = {
    mode: 'production',
    entry: './src/server.js',
    target: 'node',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            'pg-native': false,
        },
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
}
