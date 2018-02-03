var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var plugins = [];

//do we minify it all
if (process.env.NODE_ENV === 'production') {
    console.log("creating production build");
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        uglifyOptions: {
            ecma: 6
        },
        mangle: {
            keep_fnames: true
        },
        compress: {
            keep_fnames: true,
            warnings: false,
        }
    }));
    plugins.push(new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
    }));
}

/**
 * @author Dylan Vorster
 */
module.exports = [
    //for building the umd distribution
    {
        entry: './src/main.tsx',
        output: {
            filename: 'main.js',
            path: __dirname + '/dist',
        },
        plugins: plugins.concat([
            new ExtractTextPlugin({filename: '[name].css'})
        ]),
        module: {
            rules: [
                {
                    test: /\.(png|jpg|gif|woff|woff2|ttf|eot|svg)$/,
                    use: 'file-loader'
                },
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        use: 'css-loader'
                    })
                },
                {
                    test: /\.scss$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: ['css-loader', 'sass-loader']
                    })
                },
                {
                    enforce: 'pre',
                    test: /\.js$/,
                    loader: "source-map-loader"
                },
                {
                    test: /\.tsx?$/,
                    use: [
                        {
                            loader: 'ts-loader',
                            options: {
                                transpileOnly: true
                            }
                        }
                    ]
                }
            ]
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js"]
        },
        devtool: process.env.NODE_ENV === 'production' ? false : 'eval-cheap-module-source-map'
    }
];
