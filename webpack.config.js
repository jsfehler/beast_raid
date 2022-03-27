const path = require('path');

const ESLintPlugin = require('eslint-webpack-plugin');

const options = {
  exclude: ['node_modules', 'lib'],
}

module.exports = {
    mode: 'production',
    plugins: [new ESLintPlugin(options)],
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: [/node_modules/, /lib/],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [
                            ["@babel/transform-runtime", {"corejs": 3}],
                        ]
                    },
                },
            },
        ],
    },
    entry: './src/game.js',
    output: {
        library: 'beastRaid',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        filename: 'beastRaid.js',
        path: path.resolve(__dirname, 'dist'),
    },
};
