const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const config = {
    entry: {
        // 配置入口文件
        main: path.resolve(__dirname, "../src/main.tsx"),
    },
    module: {
        rules: [
            // babel转译之后的代码
            {
                test: /\.(ts|js)x?$/i,
                exclude: /node_modules/,
                loader: "babel-loader",
                include: path.resolve(__dirname, "../src"),
            },
        ],
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "../src"),
            "@views": path.resolve(__dirname, "../src/views"),
            "@common": path.resolve(__dirname, "../src/common"),
        },
        // webpack解析顺序
        extensions: [".tsx", ".ts", ".jsx", ".js", ".less"],
    },
    plugins: []
};

const lessLoader = {
    loader: "less-loader",
    options: {
        lessOptions: {
            javascriptEnabled: true,
        },
    },
};

// development | production
module.exports = function (env, publicPath) {
    let styleLoader;
    if (env === "development") {
        // dev模式插入style标签
        styleLoader = "style-loader";
    } else if (env === "production") {
        styleLoader = MiniCssExtractPlugin.loader;
    } else {
        throw new Error("环境变量为 development 或 production");
    }

    config.module.rules.push(
        {
            test: /\.less$/i,
            exclude: [/node_modules/, /style.less/],
            use: [
                styleLoader,
                {
                    loader: "css-loader",
                    options: {
                        modules: true,
                    },
                },
                lessLoader,
            ],
        },
        {
            // style.less 不能使用 css module
            test: /\.less$/i,
            use: [styleLoader, "css-loader", lessLoader],
            include: path.resolve(__dirname, "../src/style.less"),
        },
        {
            test: [
                /\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/,
                /\.eot$/, /\.woff2/, /\.woff$/, /\.ttf$/
            ],
            type: 'asset/resource',
            generator: {
                outputPath: 'assets/',
                publicPath: `${publicPath}assets/`,
                filename: '[name][ext]'
            },
        },
    );

    config.plugins.push(
        // 打包html
        new HtmlWebpackPlugin({
            title: "React Build",
            template: "public/index.html",
            publicPath: publicPath
        }),
    )

    return config;
};
