require('pg');

const databaseName = "postgres";

const connection_url = process.env.DATABASE_URL || `postgres://postgres:@localhost:5432/${databaseName}`;

module.exports = {
  client: 'pg',
  ssl: true,
  connection: connection_url,
  migrations: {
    directory: __dirname + '/db/migrations'
  }
};
