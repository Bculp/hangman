module.exports = {
	entry: './browser/app/app.js',
	output: {
		path: __dirname,
		filename: './public/bundle.js',
		publicPath: '/'
  },
  mode: "production",
	module: {
    rules: [
			{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
					presets: ['@babel/react', '@babel/env']
        }
			}
		]
	}
};
