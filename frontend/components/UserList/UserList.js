import { useQuery } from '@apollo/react-hooks';
import { NetworkStatus } from 'apollo-client';
import gql from 'graphql-tag';
import ErrorMessage from '../ErrorMessage';

export const ALL_USERS_QUERY = gql`
  query Users($offset: Int!, $limit: Int!) {
    users_aggregate(limit: $limit, offset: $offset) {
      nodes {
        id
        email
        username
        created_at
      }
      aggregate {
        count
      }
    }
  }
`;

export const allUsersQueryVars = {
  offset: 0,
  limit: 10,
};

export default function UserList() {
  const { loading, error, data, fetchMore, networkStatus } = useQuery(ALL_USERS_QUERY, {
    variables: allUsersQueryVars,
    notifyOnNetworkStatusChange: true,
  });

  const loadingMore = networkStatus === NetworkStatus.fetchMore;

  if (error) return <ErrorMessage message="Error loading posts." />;
  if (loading && !loadingMore) return <div>Loading</div>;

  const { nodes, aggregate } = data.users_aggregate;
  const areMoreNodes = nodes.length < aggregate.count;

  const loadMoreNodes = () => {
    fetchMore({
      variables: {
        skip: nodes.length,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return previousResult;
        }
        return Object.assign({}, previousResult, {
          nodes: [...previousResult.nodes, ...fetchMoreResult.nodes],
        });
      },
    });
  };

  return (
    <section>
      <ul>
        {nodes.map((user, index) => (
          <li key={user.id}>
            <div>
              <span>{index + 1}. </span>
              <a href={user.url}>{user.username}</a>
            </div>
          </li>
        ))}
      </ul>
      {areMoreNodes && (
        <button onClick={() => loadMoreNodes()} disabled={loadingMore}>
          {loadingMore ? 'Loading...' : 'Show More'}
        </button>
      )}
      <style jsx>{`
        section {
          padding-bottom: 20px;
        }
        li {
          display: block;
          margin-bottom: 10px;
        }
        div {
          align-items: center;
          display: flex;
        }
        a {
          font-size: 14px;
          margin-right: 10px;
          text-decoration: none;
          padding-bottom: 0;
          border: 0;
        }
        span {
          font-size: 14px;
          margin-right: 5px;
        }
        ul {
          margin: 0;
          padding: 0;
        }
        button:before {
          align-self: center;
          border-style: solid;
          border-width: 6px 4px 0 4px;
          border-color: #ffffff transparent transparent transparent;
          content: '';
          height: 0;
          margin-right: 5px;
          width: 0;
        }
      `}</style>
    </section>
  );
}
