module.exports = {
  root: true, // 将eslint限制到一个特定的项目, 停止在父级目录查找
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module', // esm代码，对应module
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json'
  },
  rules: {}
}
