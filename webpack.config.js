var path = require('path');

module.exports = {
    entry: "./example/index.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    resolve: {
        alias:{
            'easy-checker':path.join(__dirname,'lib','easy-checker.js')
        }
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    }
};