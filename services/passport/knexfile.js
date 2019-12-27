require('pg');

module.exports = {
  client: 'pg',
  connection: 'postgres://localhost/mocha_chai_tv_shows_test',
  migrations: {
    directory: __dirname + '/db/migrations',
  },
  seeds: {
    directory: __dirname + '/db/seeds/test',
  },
};
