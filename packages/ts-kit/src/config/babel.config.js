module.exports = {
  presets: [
    "@babel/typescript",
    [
      "@babel/env",
      {
        useBuiltIns: "usage",
        corejs: { version: 3 },
        modules: process.env.NODE_ENV === "test",
      },
    ],
  ],
  plugins: [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-proposal-optional-chaining",
  ],
};
