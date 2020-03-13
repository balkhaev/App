const ecosystem = require('./ecosystem.prod.config');

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
      NODE_ENV: 'development',
    },
  },
);

module.exports = ecosystem;
