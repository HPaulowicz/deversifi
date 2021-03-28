const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/renderer.tsx',
    target: 'electron-renderer',
    devtool: 'source-map',
    resolve: {
        alias: {
            ['@']: path.resolve(__dirname, 'src')
        },
        extensions: ['.tsx', '.ts', '.js'],
    },
    devServer: {
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                include: /src/,
                use: [{ loader: 'ts-loader' }]
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass'
                ],
            },
            {
                test: /\.less$/i,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }, {
                    loader: "less-loader",
                    options: {
                        lessOptions: {
                            javascriptEnabled: true
                        }
                    }
                }]
            },
        ]
    },
    output: {
        path: __dirname + '/dist',
        filename: 'renderer.js',
        publicPath: '/'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ]
};
