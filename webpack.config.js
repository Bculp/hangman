module.exports = {
	entry: './browser/app/app.js',
	output: {
		path: __dirname,
		filename: './public/bundle.js',
		publicPath: '/'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "babel-loader",
				query: {
					presets: ['react', 'es2015']
				}
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
		]
	}
};
