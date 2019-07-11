const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: './src/index.jsx',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist')
	},
	devtool: 'cheap-module-eval-source-map',
	devServer: {
		contentBase: './dist',
		watchContentBase: true,
		port: 9000
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			},
			{
				test: /\.(js|jsx)$/,
				exclude: /(node_modules|bower_components)/,
        use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env', '@babel/preset-react']
					}
				}
      }
		]
	},
	plugins: [
    new CopyPlugin([
			{ from: 'index.html', to: 'index.html' },
      { from: 'css/', to: 'style.css' }
		])
  ]
};