import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: 'https://hasura-ds-test.herokuapp.com/v1/graphql',
});

export default client;
