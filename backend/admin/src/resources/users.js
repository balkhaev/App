import React from 'react';
import PersonIcon from '@material-ui/icons/Person';
import {
  List,
  Datagrid,
  Edit,
  Create,
  SimpleForm,
  DateField,
  TextField,
  EditButton,
  TextInput,
  DateInput,
  Show,
  SimpleShowLayout,
} from 'react-admin';

export const UserIcon = PersonIcon;

export const UserList = props => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="username" />
      <TextField source="email" />
      <TextField source="token" />
      <DateField label="Create date" source="created_at" />
      <EditButton basePath="/users" />
    </Datagrid>
  </List>
);

const UserTitle = ({ record }) => {
  return <span>User {record ? `"${record.name}"` : ''}</span>;
};

export const UserEdit = props => (
  <Edit title={<UserTitle />} {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput source="username" />
      <TextInput source="email" />
      <TextInput source="password" />
      <TextField disabled source="token" />
      <DateField disabled label="Create date" source="created_at" />
    </SimpleForm>
  </Edit>
);

export const UserCreate = props => (
  <Create title="Create a User" {...props}>
    <SimpleForm>
      <TextInput source="username" />
      <TextInput source="email" />
      <TextInput source="password" />
    </SimpleForm>
  </Create>
);

export const UserShow = props => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="username" />
      <TextField source="email" />
      <TextField source="password" />
      <DateField label="Create date" source="created_at" />
      <DateField label="Update date" source="updated_at" />
    </SimpleShowLayout>
  </Show>
);
