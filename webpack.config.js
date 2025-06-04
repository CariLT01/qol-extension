const path = require("path");

module.exports = {
  entry: {
    word: "./src/word.ts",
    redirect: "./src/redirect.ts"
  },
  output: {
    path: path.resolve(__dirname, "extension/src"),
    filename: "[name].js"
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  }
};