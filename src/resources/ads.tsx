import {
  BooleanField,
  BooleanInput,
  Create,
  Datagrid,
  DateField,
  Edit,
  List,
  SimpleForm,
  TextField,
  TextInput,
  UrlField,
  required,
} from 'react-admin';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';

export const adsIcon = CampaignRoundedIcon;

/**
 * Sponsored content shown in the app's report ad box. Columns match the `ads`
 * table: title, body, image_url, cta_label (button text), cta_url (link), active.
 */
export const AdsList = () => (
  <List sort={{ field: 'created_at', order: 'DESC' }} title="Sponsored Ads">
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <TextField source="title" emptyText="—" />
      <TextField source="body" label="Text" emptyText="—" />
      <TextField source="cta_label" label="Button" emptyText="—" />
      <UrlField source="cta_url" label="Link" emptyText="—" />
      <BooleanField source="active" />
      <DateField source="created_at" label="Created" />
    </Datagrid>
  </List>
);

const AdForm = () => (
  <SimpleForm>
    <TextInput source="title" validate={required()} fullWidth />
    <TextInput source="body" label="Text" multiline minRows={2} fullWidth />
    <TextInput source="image_url" label="Image URL" fullWidth />
    <TextInput source="cta_label" label="Button text (e.g. Learn more)" fullWidth />
    <TextInput source="cta_url" label="Link URL" fullWidth />
    <BooleanInput source="active" defaultValue={true} />
  </SimpleForm>
);

export const AdsCreate = () => (
  <Create title="New Ad">
    <AdForm />
  </Create>
);

export const AdsEdit = () => (
  <Edit title="Edit Ad">
    <AdForm />
  </Edit>
);
