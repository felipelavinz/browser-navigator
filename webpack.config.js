const Encore = require("@symfony/webpack-encore");
const HtmlWebpackPlugin = require("html-webpack-plugin");

Encore.setOutputPath("build/")
  .setPublicPath("/")
  .addEntry("app", "./src/app.js")
  .disableSingleRuntimeChunk()
  .enableSourceMaps(!Encore.isProduction())
  .enableReactPreset()
  .enableVersioning(false)
  .cleanupOutputBeforeBuild()
  .copyFiles({
    from: ".",
    pattern: /\.(icons|\.js|\.json)$/,
  })
  .addPlugin(
    new HtmlWebpackPlugin({
      inject: false,
      templateContent: ({ htmlWebpackPlugin }) => `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Search browser history and bookmarks.</title>
	<link rel="stylesheet" href="app.css">
</head>
<body>
	<div id="app"></div>
	<script src="app.js"></script>
</body>
</html>
`,
      title: "Browser Navigator",
    })
  );

const webpackConfig = Encore.getWebpackConfig();

module.exports = webpackConfig;
