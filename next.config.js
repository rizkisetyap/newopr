/** @type {import('next').NextConfig} */
const removeImports = require("next-remove-imports")();

module.exports = removeImports({
	reactStrictMode: true,
	basePath: "/newopr",
	staticPageGenerationTimeOut: 10000,
	distDir: "build",
});
