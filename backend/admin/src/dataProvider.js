import { fetchUtils } from 'react-admin';
import hasuraDataProvider from 'ra-data-hasura';

const httpClient = (url, options = {}) => {
  if (!options.headers) {
      options.headers = new Headers({ Accept: 'application/json' });
  }

  options.headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

  return fetchUtils.fetchJson(url, options);
};

const dataSource = hasuraDataProvider(process.env.REACT_APP_SERVICE_HASURA_ENDPOINT, httpClient);

export default dataSource
