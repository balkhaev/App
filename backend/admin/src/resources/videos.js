import React from 'react';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
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

export const VideoIcon = VideoLibraryIcon;

export const VideoList = props => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="title" />
      <ReferenceField source="author_id" reference="users">
        <TextField source="username" />
      </ReferenceField>
      <DateField label="Create date" source="created_at" />
      <DateField label="Update date" source="updated_at" />
      <EditButton basePath="/videos" />
    </Datagrid>
  </List>
);

const VideoTitle = ({ record }) => {
  return <span>Video {record ? `"${record.title}"` : ''}</span>;
};

export const VideoEdit = props => (
  <Edit title={<VideoTitle />} {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput source="title" />
      <ReferenceInput source="author_id" reference="users">
        <SelectInput source="id" />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);

export const VideoCreate = props => (
  <Create title="Create a Video" {...props}>
    <SimpleForm>
      <TextInput source="title" />
      <ReferenceInput source="author_id" reference="users">
        <SelectInput source="username" />
      </ReferenceInput>
    </SimpleForm>
  </Create>
);

export const VideoShow = props => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" />
      <ReferenceField source="author_id" reference="users">
        <TextField source="username" />
      </ReferenceField>
      <DateField label="Create date" source="created_at" />
      <DateField label="Update date" source="updated_at" />
    </SimpleShowLayout>
  </Show>
);
