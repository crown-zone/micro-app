const path = require('path');
const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//  is not compatible with webpack@5
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const publicPath = '/dist/';

const config = merge(common('production', publicPath), {
    mode: 'production',
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, '../dist'),
        publicPath: publicPath,
        // 打包前清空输出目录
        clean: true
    },
    plugins: [
        // 提取css为单独文件
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
        }),
        // 压缩css
        new OptimizeCssAssetsWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "../src/assets").replace(/\\/g, "/"),
                    to: path.resolve(__dirname, '../dist/assets')
                },
            ],
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true
                    },
                    output: {
                        ascii_only: true,
                    },
                },
                extractComments: {
                    filename: '3rd-party.licenses.txt'
                }
            })
        ],

        splitChunks: {
            // include all types of chunks
            chunks: 'all',
            // 重复打包问题
            cacheGroups: {
                vendors: { // node_modules里的代码
                    test: /[\\/]node_modules[\\/]/,
                    chunks: "all",
                    name: 'vendors',
                    priority: 10, // 优先级
                    enforce: true
                }
            }
        },

        runtimeChunk: {
            name: 'runtime'
        },
    }
});

module.exports = function () {
    if (process.env.BUNDLE_ANALYZER === 'true') {
        config.plugins.push(
            // bundle分析
            new WebpackBundleAnalyzer()
        );
    }

    return config;
};
