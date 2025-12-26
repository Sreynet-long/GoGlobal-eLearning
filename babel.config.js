module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      "babel-preset-expo"
    ],

    plugins: [
      // Enables clean absolute imports
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@app": "./app",
            "@utils": "./utils",
            "@config": "./config",
            "@assets": "./assets"
          }
        }
      ]
    ]
  };
};
