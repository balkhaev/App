import React from 'react';
import { Admin, Resource, ListGuesser } from 'react-admin';

import { CompanyIcon, CompanyList, CompanyEdit, CompanyCreate } from './resources/companies';
import { VideoIcon, VideoList, VideoEdit, VideoCreate, VideoShow } from './resources/videos';
import { UserIcon, UserList, UserEdit, UserCreate, UserShow } from './resources/users';
import { FileIcon, FileList, FileEdit, FileCreate, FileShow } from './resources/files';
import { RoleIcon, RoleList, RoleEdit, RoleCreate, RoleShow } from './resources/roles';

import authProvider from './authProvider';
import dataProvider from './dataProvider';

import theme from './theme';

const App = () => (
  <Admin theme={theme} authProvider={authProvider} dataProvider={dataProvider}>
    {permission => [
      <Resource
        name="videos"
        icon={VideoIcon}
        list={VideoList}
        edit={VideoEdit}
        create={VideoCreate}
        show={VideoShow}
      />,
      <Resource name="users" icon={UserIcon} list={UserList} edit={UserEdit} create={UserCreate} show={UserShow} />,
      <Resource name="roles" icon={RoleIcon} list={RoleList} edit={RoleEdit} create={RoleCreate} show={RoleShow} />,
      <Resource name="companies" icon={CompanyIcon} list={CompanyList} edit={CompanyEdit} create={CompanyCreate} />,
      <Resource name="files" icon={FileIcon} list={FileList} edit={FileEdit} create={FileCreate} show={FileShow} />,
      <Resource name="comments" list={ListGuesser} />,
    ]}
  </Admin>
);

export default App;
