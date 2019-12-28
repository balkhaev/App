const { GraphQLClient } = require('graphql-request');

module.exports = new GraphQLClient(process.env.SERVICE_GRAPHQL_ENDPOINT);
