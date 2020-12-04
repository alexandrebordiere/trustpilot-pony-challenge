module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  coveragePathIgnorePatterns: [
    '/src/http.ts',
    '/src/main.ts',
    '/src/shims-vue.d.ts',
    '/src/types.ts'
  ],
  testMatch: [
    '**/test/**/*.spec.ts'
  ],
  transform: {
    '^.+\\.vue$': 'vue-jest'
  }
};
