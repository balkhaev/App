import { useQuery } from '@apollo/react-hooks';
import { NetworkStatus } from 'apollo-client';
import gql from 'graphql-tag';
import ErrorMessage from '../ErrorMessage';
import PostUpvoter from '../PostUpvoter';

export const ALL_VIDEOS_QUERY = gql`
  query Videos($offset: Int!, $limit: Int!) {
    videos_aggregate(limit: $limit, offset: $offset) {
      nodes {
        title
        id
        created_at
        author {
          id
          username
          email
        }
      }
      aggregate {
        count
      }
    }
  }
`;

export const allVideosQueryVars = {
  offset: 0,
  limit: 10,
};

export default function PostList() {
  const { loading, error, data, fetchMore, networkStatus } = useQuery(ALL_VIDEOS_QUERY, {
    variables: allVideosQueryVars,
    notifyOnNetworkStatusChange: true,
  });

  const loadingMoreVideos = networkStatus === NetworkStatus.fetchMore;

  if (error) return <ErrorMessage message="Error loading posts." />;
  if (loading && !loadingMoreVideos) return <div>Loading</div>;

  const { nodes, aggregate } = data.videos_aggregate;
  const areMoreVideos = nodes.length < aggregate.count;

  const loadMoreVideos = () => {
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
        {nodes.map((video, index) => (
          <li key={video.id}>
            <div>
              <span>{index + 1}. </span>
              <a href={video.url}>{video.title}</a>
              <PostUpvoter id={video.id} votes={video.votes} />
            </div>
          </li>
        ))}
      </ul>
      {areMoreVideos && (
        <button onClick={() => loadMoreVideos()} disabled={loadingMoreVideos}>
          {loadingMoreVideos ? 'Loading...' : 'Show More'}
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
