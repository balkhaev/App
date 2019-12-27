import React from 'react';
import StoreIcon from '@material-ui/icons/Store';
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
} from 'react-admin';

export const CompanyIcon = StoreIcon;

export const CompanyList = props => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <DateField label="Create date" source="created_at" />
      <DateField label="Update date" source="updated_at" />
      <EditButton basePath="/companies" />
    </Datagrid>
  </List>
);

const CompanyTitle = ({ record }) => {
  return <span>Company {record ? `"${record.name}"` : ''}</span>;
};

export const CompanyEdit = props => (
  <Edit title={<CompanyTitle />} {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput source="name" />
      <DateInput disabled label="Create date" source="created_at" />
      <DateInput disabled label="Update date" source="updated_at" />
    </SimpleForm>
  </Edit>
);

export const CompanyCreate = props => (
  <Create title="Create a Company" {...props}>
    <SimpleForm>
      <TextInput source="name" />
    </SimpleForm>
  </Create>
);
