module.exports = {
  env: {
    es6: true,
    jest: true,
    browser: true, // TODO: get rid of for production
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  "parser": "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2017,
    sourceType: "module"
  },
  plugins: ["react"],
  rules: {
    indent: ["error", 4],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "max-len": [1, 100, 4],
    "no-console": 0, // TODO: get rid of for production
  }
};
