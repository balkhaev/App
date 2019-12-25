import React from 'react';
import hasuraDataProvider from 'ra-data-hasura';
import { Admin, Resource, ListGuesser } from 'react-admin';

import { VideoIcon, VideoList, VideoEdit, VideoCreate, VideoShow } from './videos';
import { UserIcon, UserList, UserEdit, UserCreate, UserShow } from './users';
import { FileIcon, FileList, FileEdit, FileCreate, FileShow } from './files';

import theme from './theme';

const headers = { 'content-type': 'application/json', authorization: 'bearer <token>' };

const App = () => (
  <Admin theme={theme} dataProvider={hasuraDataProvider('https://hasura-ds-test.herokuapp.com', headers)}>
    <Resource name="videos" icon={VideoIcon} list={VideoList} edit={VideoEdit} create={VideoCreate} show={VideoShow} />
    <Resource name="users" icon={UserIcon} list={UserList} edit={UserEdit} create={UserCreate} show={UserShow} />
    <Resource name="files" icon={FileIcon} list={FileList} edit={FileEdit} create={FileCreate} show={FileShow} />
    <Resource name="comments" list={ListGuesser} />
  </Admin>
);

export default App;
