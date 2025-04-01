// src/setupEnv.cjs
global.import = {
  meta: {
    env: {
      VITE_EMAIL_SERVICE_ID: 'test-service-id',
      VITE_EMAIL_TEMPLATE_ID: 'test-template-id',
      VITE_EMAIL_USER_ID: 'test-user-id'
    }
  }
};