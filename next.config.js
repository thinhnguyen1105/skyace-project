const withTypeScript = require("@zeit/next-typescript");
const withCss = require("@zeit/next-css");

// fix: prevents error when .css files are required by node
if (typeof require !== "undefined") {
  require.extensions[".css"] = file => {};
}

module.exports = withTypeScript(
  withCss({
    webpack: function(config, { dev }) {
      if (dev) {
        config.devtool = "cheap-module-source-map";
      }
      return config;
    }
  })
);
