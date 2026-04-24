const path = require("path");

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "@babel/plugin-transform-typescript",
        { allowDeclareFields: true, allExtensions: true, isTSX: true },
      ],
      ["@babel/plugin-proposal-decorators", { legacy: true }],
      ["@babel/plugin-proposal-class-properties", { loose: true }],
      [
        "module-resolver",
        {
          root: ["."],
          extensions: [
            ".ios.js",
            ".android.js",
            ".js",
            ".jsx",
            ".json",
            ".ts",
            ".tsx",
          ],
          alias: {
            data: path.resolve(__dirname, "../data"),
          },
        },
      ],
      [
        "react-native-unistyles/plugin",
        {
          root: "app",
        },
      ],
      // Must be last
      "react-native-reanimated/plugin",
    ],
  };
};
