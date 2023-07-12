const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");

module.exports = merge(common("development", ''), {
    mode: "development",
    plugins: [],
    devtool: "inline-source-map",
    // 本地服务配置
    devServer: {
        historyApiFallback: true,
        port: 8888,
        headers: {
            "Access-Control-Allow-Origin": "*", // 解决跨域
        },
        static: [
            {
                directory: path.resolve(__dirname, '../static'),
                publicPath: '/static'
            },
            {
                directory: path.resolve(__dirname, '../src/assets'),
                publicPath: '/assets',
            }
        ],
    },
});
