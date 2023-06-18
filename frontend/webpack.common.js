const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: "./src/index.js",
    module: {
        rules:[
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.html$/,
                use: ['html-loader']
            },
            // {
            //     test: /\.(svg|png|jpg|gif)$/,
            //     use: {
            //         loader: 'file-loader',
            //         options: {
            //             name: "/src/assets/[name].[hash].[ext]",
            //             outputPath: "assets"
            //         }
            //     }
            // }
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff)$/,
                type: 'asset/resource'
             }
        ]
    },
    plugins: [
            new htmlWebpackPlugin({
                template: './src/template.html'
            })
    ]
}