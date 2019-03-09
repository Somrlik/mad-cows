const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const fs = require('fs');

const WEBPACK_COMPILING_DESTINATION = path.resolve(__dirname, 'dist/public');
const TYPESCRIPT_ENTRY_POINT = './src/client/client.ts';

if (! fs.existsSync(TYPESCRIPT_ENTRY_POINT)) {
    console.error(`The file ${TYPESCRIPT_ENTRY_POINT} required as entry point does not exist!`);
    console.error(`This is most likely caused by running the build in dev mode.`);
    console.error(`Please set your NODE_ENV to production and try again.`);
    process.exit(1);
}

/**
 * @type {webpack.Configuration}
 */
let webpackConfig = {
    mode: 'production',
    entry: [
        './src/client/client.ts',
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [WEBPACK_COMPILING_DESTINATION + '/*'],
        }),
        new HtmlWebpackPlugin({
            title: 'Mad Cowz',
            favicon: 'assets/favicon.ico',
        })
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'bundle.js',
        path: WEBPACK_COMPILING_DESTINATION,
    }
};

if ((process.env.NODE_ENV || 'dev') === 'dev') {
    webpackConfig = {
        ...webpackConfig,
        mode: 'development',
        devtool: 'inline-source-map',
        devServer: {
            contentBase: './public'
        },
    };

    // Hit module reload config
    webpackConfig.entry.push('webpack-hot-middleware/client');
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
}

module.exports = webpackConfig;
