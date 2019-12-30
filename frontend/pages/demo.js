import { useQuery, useMutation } from '@apollo/react-hooks';
import { Vertee } from 'bb-vertee';
import gql from 'graphql-tag';

import Page from '../layouts/Page';
import { withApollo } from '../lib/apollo';

export const GET_VIDEO_TOKEN = gql`
  query Content($contentId: ID!, $platformId: ID!) {
    content(contentId: $contentId, platformId: $platformId) {
      token
    }
  }
`;

export const CREATE_PURCHASE = gql`
  mutation CreatePurchase($token: String!, $clientIp: String!) {
    createPurchase(token: $token) {
      video {
        playlist(clientIp: $clientIp)
      }
    }
  }
`;

const DemoPage = props => {
  const { data: { token } = {} } = useQuery(GET_VIDEO_TOKEN, {
    variables: {
      platformId: 'LbU7AGVK8HvYRnho5e-kPQ',
      contentId: 'j8wn8NKFE1xE42isEszJtQ',
    },
  });

  const [createPurchase, { data, loading }] = useMutation(CREATE_PURCHASE, {
    variables: {
      token,
      clientIp: '',
    },
  });

  if (!token || loading) {
    return <Page>Loading...</Page>;
  }

  createPurchase();

  return (
    <Page>
      <Vertee src={data.createPurchase.video.playlist} vxml="/vxml/simple.vxml" frameRate={25} debug={true} />
    </Page>
  );
};

export default withApollo(DemoPage);
