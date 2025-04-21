// jest.config.cjs
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTests.js'
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)': '<rootDir>/__mocks__/fileMock.js'
  },
  transform: {
    '^.+\\.(js|jsx)': ['babel-jest', { configFile: './babel.config.cjs' }]
  },
  transformIgnorePatterns: [
    '/node_modules/(?!emailjs-com).+\\.js'

  ],
  testMatch: [
    '**/__tests__/**/*.js?(x)',
    '**/?(*.)+(spec|test).js?(x)'
  ],
  globals: {
    'import.meta': {
      env: {
        VITE_EMAIL_SERVICE_ID: 'test-service-id',
        VITE_EMAIL_TEMPLATE_ID: 'test-template-id',
        VITE_EMAIL_USER_ID: 'test-user-id'
      }
    }
  }
};

// // jest.config.cjs
// module.exports = {
//   testEnvironment: 'jsdom',
//   setupFilesAfterEnv: [
//     '<rootDir>/src/setupTests.js',
//     '<rootDir>/src/setupEnv.cjs'
//   ],
//   moduleNameMapper: {
//     '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
//     '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js'
//   },
//   transform: {
//     '^.+\\.(js|jsx)$': ['babel-jest', { configFile: './babel.config.cjs' }]
//   },
//   transformIgnorePatterns: [
//     '/node_modules/(?!emailjs-com).+\\.js$'
//   ]
// };