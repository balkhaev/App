const {
  GRAPHQL_ENDPOINT = 'https://staging.reallco.com/api/graphql',
} = process.env;

module.exports = {
  env: {
    GRAPHQL_ENDPOINT,
  },
};
