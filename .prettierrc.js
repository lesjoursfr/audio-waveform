module.exports = {
  printWidth: 120,
  trailingComma: "es5",
  overrides: [
    {
      files: [".eslintrc.js", ".prettierrc.js", "*.json"],
      options: {
        printWidth: 80,
      },
    },
  ],
};
