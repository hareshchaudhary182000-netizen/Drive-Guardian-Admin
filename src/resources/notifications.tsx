import {
  BooleanField,
  BooleanInput,
  Create,
  Datagrid,
  DateField,
  Edit,
  List,
  SelectInput,
  SimpleForm,
  TextField,
  TextInput,
  required,
} from 'react-admin';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';

export const notificationsIcon = NotificationsActiveRoundedIcon;

/**
 * Push notifications broadcast to every app user. Creating an active row sends
 * a push automatically (via the send-push Edge Function trigger) AND shows it
 * in the app's in-app notifications feed. Columns match the `notifications`
 * table: title, body, type, active, created_at, sent_at.
 */
const TYPE_CHOICES = [
  { id: 'general', name: 'General' },
  { id: 'alert', name: 'Alert' },
  { id: 'tip', name: 'Tip' },
  { id: 'update', name: 'Update' },
];

export const NotificationsList = () => (
  <List sort={{ field: 'created_at', order: 'DESC' }} title="Notifications">
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <TextField source="title" emptyText="—" />
      <TextField source="body" label="Message" emptyText="—" />
      <TextField source="type" emptyText="general" />
      <BooleanField source="active" />
      <DateField source="created_at" label="Created" showTime />
      <DateField source="sent_at" label="Sent" showTime emptyText="—" />
    </Datagrid>
  </List>
);

const NotificationForm = () => (
  <SimpleForm>
    <TextInput source="title" validate={required()} fullWidth />
    <TextInput
      source="body"
      label="Message"
      validate={required()}
      multiline
      minRows={3}
      fullWidth
    />
    <SelectInput
      source="type"
      choices={TYPE_CHOICES}
      defaultValue="general"
      helperText="Controls the icon/colour shown in the app"
    />
    <BooleanInput
      source="active"
      defaultValue={true}
      helperText="When on, the notification is sent to all users and shown in-app"
    />
  </SimpleForm>
);

export const NotificationsCreate = () => (
  <Create title="New Notification" redirect="list">
    <NotificationForm />
  </Create>
);

export const NotificationsEdit = () => (
  <Edit title="Edit Notification">
    <NotificationForm />
  </Edit>
);
