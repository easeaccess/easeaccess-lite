// EaseAccess Lite — webpack config.
const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const pkg = require("./package.json");

const sharedOptimization = {
	minimize: true,
	minimizer: [
		new TerserPlugin({
			parallel: true,
			terserOptions: {
				format: { comments: false },
				compress: { drop_console: true },
			},
			extractComments: false,
		}),
	],
};

const sharedWatchOptions = {
	...defaultConfig.watchOptions,
	ignored: ["**/node_modules", "**/dist", "**/build", "**/.git"],
	poll: 1000,
};

const sharedResolve = {
	alias: {
		"@": path.resolve(__dirname, "src"),
	},
	extensions: [".js", ".jsx", ".ts", ".tsx"],
};

const sharedModuleRules = [
	...defaultConfig.module.rules.filter(
		(rule) => !rule.test || !rule.test.toString().includes("css"),
	),
	{
		test: /\.(js|jsx)$/,
		exclude: /node_modules/,
		use: {
			loader: "babel-loader",
			options: {
				presets: [["@babel/preset-react", { runtime: "automatic" }]],
			},
		},
	},
	{
		test: /\.css$/,
		use: [
			"style-loader",
			"css-loader",
			{
				loader: "postcss-loader",
				options: {
					postcssOptions: {
						plugins: [require("@tailwindcss/postcss")],
					},
				},
			},
		],
	},
	{
		test: /\.(woff|woff2|eot|ttf|otf)$/i,
		include: path.resolve(__dirname, "src/fonts"),
		type: "asset/resource",
		generator: { filename: "fonts/[name][ext]" },
	},
];

// Admin bundle — uses WP externals (@wordpress/element etc. are global in admin).
const adminConfig = {
	...defaultConfig,
	optimization: sharedOptimization,
	watchOptions: sharedWatchOptions,
	entry: {
		admin: path.resolve(__dirname, "src/admin/index.js"),
	},
	output: {
		path: path.resolve(__dirname, "build"),
		filename: "[name].js",
		chunkFilename: "[name].js",
		publicPath: "auto",
	},
	resolve: sharedResolve,
	module: { rules: sharedModuleRules },
	plugins: [
		...(defaultConfig.plugins || []),
		new webpack.DefinePlugin({
			"process.env.EASEACCESS_BUILD": JSON.stringify("lite"),
			__EASEACCESS_PRO__: JSON.stringify(false),
			__EASEACCESS_VERSION__: JSON.stringify(pkg.version),
		}),
	],
};

// Frontend bundle — self-contained (no WP externals on public pages).
const frontendConfig = {
	...defaultConfig,
	name: "frontend",
	optimization: sharedOptimization,
	watchOptions: sharedWatchOptions,
	entry: {
		frontend: path.resolve(__dirname, "src/frontend/index.js"),
	},
	output: {
		path: path.resolve(__dirname, "build"),
		filename: "[name].js",
		chunkFilename: "[name].js",
		publicPath: "auto",
	},
	resolve: sharedResolve,
	module: { rules: sharedModuleRules },
	externals: {},
	plugins: [
		...(defaultConfig.plugins || []).filter(
			(plugin) => plugin.constructor.name !== "DependencyExtractionWebpackPlugin",
		),
		new webpack.ProvidePlugin({ React: "react" }),
		new webpack.DefinePlugin({
			"process.env.EASEACCESS_BUILD": JSON.stringify("lite"),
			__EASEACCESS_PRO__: JSON.stringify(false),
			__EASEACCESS_VERSION__: JSON.stringify(pkg.version),
		}),
	],
};

module.exports = [adminConfig, frontendConfig];
