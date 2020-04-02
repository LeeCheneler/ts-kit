module.exports.createJestConfig = () => {
  return {
    testURL: "http://localhost",
    transform: {
      ".(js|jsx|ts|tsx)$": require.resolve("./files/jestPreprocessor"),
    },
  };
};
