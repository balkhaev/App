import React from 'react';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
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
  ReferenceField,
} from 'react-admin';

export const RoleIcon = VerifiedUserIcon;

export const RoleList = props => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <DateField label="Create date" source="created_at" />
      <DateField label="Update date" source="updated_at" />
      <EditButton basePath="/roles" />
    </Datagrid>
  </List>
);

const RoleTitle = ({ record }) => {
  return <span>Role {record ? `"${record.name}"` : ''}</span>;
};

export const RoleEdit = props => (
  <Edit title={<RoleTitle />} {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput source="name" />
      <DateInput disabled label="Create date" source="created_at" />
      <DateInput disabled label="Update date" source="updated_at" />
    </SimpleForm>
  </Edit>
);

export const RoleCreate = props => (
  <Create title="Create a Video" {...props}>
    <SimpleForm>
      <TextInput source="title" />
      <TextInput source="author_id" />
      <DateInput label="Create date" source="created_at" />
      <DateInput label="Update date" source="updated_at" />
    </SimpleForm>
  </Create>
);

export const RoleShow = props => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" />
      <ReferenceField source="author_id" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <DateField label="Create date" source="created_at" />
      <DateField label="Update date" source="updated_at" />
    </SimpleShowLayout>
  </Show>
);
