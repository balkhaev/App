module.exports = {
  apps: [
    {
      name: 'App Frontend',
      cwd: './frontend',
      script: './server.js',
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      watch: ['server'],
      max_memory_restart: '1G',
      env: {
        PORT: 3000,
        NODE_ENV: 'development',
        BACKEND_ENDPOINT: 'http://localhost:4000/api',
      },
      env_staging: {
        NODE_ENV: 'staging',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'App Backend',
      cwd: './backend',
      script: './api/server.js',
      instances: 1,
      autorestart: true,
      max_restarts: 5,
      watch: true,
      max_memory_restart: '1G',
      env: {
        PORT: 4000,
        NODE_ENV: 'development',
        SERVICE_UPLOAD_ENDPOINT: 'http://localhost:1080/files/',
        SERVICE_GRAPHQL_ENDPOINT: 'https://hasura-ds-test.herokuapp.com/v1/graphql',
        SERVICE_AUTH_LOGIN_ENDPOINT: 'http://localhost:4003/login',
        SERVICE_AUTH_SIGNUP_ENDPOINT: 'http://localhost:4003/signup',
        SERVICE_AUTH_WEBHOOK_ENDPOINT: 'http://localhost:4003/webhook',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'Service Upload',
      cwd: './services/sendi',
      script: './run.js',
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      watch: true,
      max_memory_restart: '1G',
      env: {
        PORT: 4002,
        NODE_ENV: 'development',
        FILE_CALLBACK_ENDPOINT: 'http://localhost:3000/api/callback/file',
      },
      env_staging: {
        NODE_ENV: 'staging',
        FILE_CALLBACK_ENDPOINT: 'https://staging.reallco.com/api/callback/file',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'Service Passport',
      cwd: './services/passport',
      script: './bin/www',
      exec_interpreter: 'node',
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
      'post-deploy': './.bin/install.sh && git checkout -- . && npm run prod && pm2 save',
      // Зачем "git checkout -- ."? А затем что на винде билдятся одни package-lock'и, а на стейдже другие. Хахаха, пошел я нахуй.
      env: {
        NODE_ENV: 'staging',
      },
    },
  },
};
