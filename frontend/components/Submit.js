import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { ALL_VIDEOS_QUERY, allVideosQueryVars } from './VideoList';

const CREATE_POST_MUTATION = gql`
  mutation createPost($title: String!, $url: String!) {
    createPost(title: $title, url: $url) {
      id
      title
      votes
      url
      createdAt
    }
  }
`;

export default function Submit() {
  const [createPost, { loading }] = useMutation(CREATE_POST_MUTATION);

  const handleSubmit = event => {
    event.preventDefault();

    const form = event.target;
    const formData = new window.FormData(form);
    const title = formData.get('title');
    const url = formData.get('url');

    form.reset();

    createPost({
      variables: { title, url },
      update: (proxy, { data: { createPost } }) => {
        const data = proxy.readQuery({
          query: ALL_VIDEOS_QUERY,
          variables: allVideosQueryVars,
        });
        // Update the cache with the new post at the top of the
        proxy.writeQuery({
          query: ALL_VIDEOS_QUERY,
          data: {
            ...data,
            allPosts: [createPost, ...data.allPosts],
          },
          variables: allVideosQueryVars,
        });
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Submit</h1>
      <input placeholder="title" name="title" type="text" required />
      <input placeholder="url" name="url" type="url" required />
      <button type="submit" disabled={loading}>
        Submit
      </button>
      <style jsx>{`
        form {
          border-bottom: 1px solid #ececec;
          padding-bottom: 20px;
          margin-bottom: 20px;
        }
        h1 {
          font-size: 20px;
        }
        input {
          display: block;
          margin-bottom: 10px;
        }
      `}</style>
    </form>
  );
}
