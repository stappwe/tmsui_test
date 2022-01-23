const baseConfig = require('./jest.base.config.js');

module.exports = {
  ...baseConfig,
  roots: ['<rootDir>/projects/tms-library'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/projects/tms-library/tsconfig.spec.json'
    }
  }
};
