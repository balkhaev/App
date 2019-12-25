import React from 'react';
import FolderIcon from '@material-ui/icons/Folder';
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
  DateInput,
  Show,
  SimpleShowLayout,
  ReferenceInput,
  ReferenceField,
} from 'react-admin';

export const FileIcon = FolderIcon;

export const FileList = props => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="title" />
      <ReferenceField source="author_id" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <DateField label="Create date" source="created_at" />
      <DateField label="Update date" source="updated_at" />
      <EditButton basePath="/videos" />
    </Datagrid>
  </List>
);

const FileTitle = ({ record }) => {
  return <span>File {record ? `"${record.title}"` : ''}</span>;
};

export const FileEdit = props => (
  <Edit title={<FileTitle />} {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput source="title" />
      <ReferenceInput source="author_id" reference="users">
        <SelectInput source="name" />
      </ReferenceInput>
      <DateInput label="Create date" source="created_at" />
      <DateInput label="Update date" source="updated_at" />
    </SimpleForm>
  </Edit>
);

export const FileCreate = props => (
  <Create title="Create a Video" {...props}>
    <SimpleForm>
      <TextInput source="title" />
      <TextInput source="author_id" />
      <DateInput label="Create date" source="created_at" />
      <DateInput label="Update date" source="updated_at" />
    </SimpleForm>
  </Create>
);

export const FileShow = props => (
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
