module.exports = {
  apps: [
    {
      name: 'App Frontend',
      cwd: './frontend',
      script: './server.js',
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      watch: false,
      max_memory_restart: '1G',
      env: {
        PORT: 3000,
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'App Backend',
      cwd: './backend',
      script: './app/server.js',
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      watch: true,
      max_memory_restart: '1G',
      env: {
        PORT: 4000,
        NODE_ENV: 'development',
        SERVICE_AUTH_LOGIN_ENDPOINT: 'http://localhost:4003/login',
        SERVICE_AUTH_SIGNUP_ENDPOINT: 'http://localhost:4003/signup',
        SERVICE_AUTH_WEBHOOK_ENDPOINT: 'http://localhost:4003/webhook',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'Service Admin',
      cwd: './services/admin',
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
        REACT_APP_SERVICE_HASURA_ENDPOINT: 'https://hasura-ds-test.herokuapp.com',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'Service Upload',
      cwd: './services/uploader',
      script: './server.js',
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      watch: true,
      max_memory_restart: '1G',
      env: {
        PORT: 4002,
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'Service Passport',
      cwd: './services/passport',
      script: './server.js',
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      watch: true,
      max_memory_restart: '1G',
      env: {
        PORT: 4003,
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
  deploy: {
    staging: {
      user: 'node',
      host: ['104.248.83.244'],
      ref: 'origin/master',
      repo: ' git@lab.datascreen.ru:balkhaev/kinovert.git',
      path: '/home/node/kinovert',
      'post-deploy': './install.sh',
    },
  },
};
