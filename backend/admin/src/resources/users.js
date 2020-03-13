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
  SelectInput,
  ReferenceField,
  ReferenceInput,
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
      <ReferenceField source="role_id" reference="roles">
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField source="company_id" reference="companies">
        <TextField source="name" />
      </ReferenceField>
      <DateField source="created_at" />
      <EditButton basePath="/users" />
    </Datagrid>
  </List>
);

const UserTitle = ({ record }) => {
  return <span>User {record ? `"${record.username}"` : ''}</span>;
};

export const UserEdit = props => (
  <Edit title={<UserTitle />} {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput source="username" />
      <TextInput source="email" />
      <ReferenceInput source="role_id" reference="roles">
        <SelectInput source="name" />
      </ReferenceInput>
      <ReferenceInput source="company_id" reference="companies">
        <SelectInput source="name" />
      </ReferenceInput>
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
      <ReferenceInput source="role_id" reference="roles">
        <SelectInput source="name" />
      </ReferenceInput>
      <ReferenceInput source="company_id" reference="companies">
        <SelectInput source="name" />
      </ReferenceInput>
      <TextInput source="token" />
    </SimpleForm>
  </Create>
);

export const UserShow = props => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="username" />
      <TextField source="email" />
      <ReferenceField source="role_id" reference="roles">
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField source="company_id" reference="companies">
        <TextField source="name" />
      </ReferenceField>
      <TextField source="token" />
      <DateField label="Created date" source="created_at" />
      <DateField label="Updated date" source="updated_at" />
    </SimpleShowLayout>
  </Show>
);
