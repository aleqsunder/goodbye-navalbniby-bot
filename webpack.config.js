const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
    target: 'node',
    
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                },
            },
        ],
    },
    mode: 'development',
}
