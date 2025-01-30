module.exports = function () {
  return {
    files: [
      'src/**/*.ts',
    ],

    tests: [
      'spec/tests/**/*.js',
    ],

    env: {
      type: 'node',
      runner: 'npx jasmine-browser-runner runSpecs',
    },

    testFramework: 'jasmine',
  };
};
