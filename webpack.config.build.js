var path = require('path');

module.exports = {
    entry: path.join(__dirname,'lib','easy-checker.js'),
    output: {
        path: __dirname,
        filename: "dist.js"
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    }
};