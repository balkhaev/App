const ecosystem = require('./ecosystem.config');

ecosystem.apps.push(
  {
    name: 'Admin',
    cwd: './backend/admin',
    script: './node_modules/react-scripts/scripts/start.js',
    instances: 1,
    autorestart: true,
    max_restarts: 10,
    watch: false,
    max_memory_restart: '1G',
    env: {
      PORT: 4001,
      BROWSER: 'none',
      NODE_ENV: 'development',
      REACT_APP_SERVICE_AUTH_LOGIN_ENDPOINT: 'http://localhost:4003/login',
      REACT_APP_SERVICE_AUTH_SIGNUP_ENDPOINT: 'http://localhost:4003/signup',
    },
  },
);

module.exports = ecosystem;
