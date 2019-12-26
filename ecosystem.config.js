module.exports = {
  apps: [
    {
      name: 'App Backend',
      cwd: './backend',
      script: './api/server.js',
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
      name: 'Service Upload',
      cwd: './services/uploader',
      script: './src/server.js',
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
      script: './src/server.js',
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
    },
  ],
  deploy: {
    staging: {
      user: 'node',
      host: ['104.248.83.244'],
      ref: 'origin/master',
      repo: ' git@lab.datascreen.ru:balkhaev/kinovert.git',
      path: '/home/node/kinovert',
      'post-deploy': 'chmod +x ./.bin/install.sh && ./.bin/install.sh && npm run prod && pm2 save',
    },
  },
};
