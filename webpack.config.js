var path = require('path');

module.exports = {
    entry: "./example/index.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    resolve: {
        alias:{
            'easy-typed':path.join(__dirname,'easy-typed.js')
        }
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    }
};