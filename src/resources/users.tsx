import {
  Datagrid,
  DateField,
  EmailField,
  FunctionField,
  List,
  ReferenceManyCount,
  Show,
  SimpleShowLayout,
  TextField,
  SearchInput,
} from 'react-admin';
import { Avatar, Chip, Stack, Typography } from '@mui/material';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';

export const usersIcon = PersonRoundedIcon;

const filters = [
  <SearchInput source="name" alwaysOn placeholder="Search name" key="q" />,
];

const NameCell = (r: any) => (
  <Stack direction="row" spacing={1.5} alignItems="center">
    <Avatar src={r.avatar_url} sx={{ width: 34, height: 34 }}>
      {(r.name || '?').charAt(0).toUpperCase()}
    </Avatar>
    <Typography fontWeight={700}>{r.name || 'Driver'}</Typography>
  </Stack>
);

export const UsersList = () => (
  <List filters={filters} sort={{ field: 'name', order: 'ASC' }} title="Drivers">
    <Datagrid rowClick="show" bulkActionButtons={false}>
      <FunctionField label="Driver" render={NameCell} />
      <EmailField source="email" label="Email" emptyText="—" />
      <TextField source="phone" label="Phone" emptyText="—" />
      <FunctionField
        label="Role"
        render={(r: any) => (
          <Chip
            size="small"
            label={r.role || 'Driver'}
            color={r.role === 'admin' ? 'secondary' : 'default'}
            variant={r.role === 'admin' ? 'filled' : 'outlined'}
          />
        )}
      />
      <ReferenceManyCount label="Partners" reference="partners" target="owner_id" />
      <DateField source="member_since" label="Member since" emptyText="—" />
    </Datagrid>
  </List>
);

export const UsersShow = () => (
  <Show title="Driver">
    <SimpleShowLayout>
      <FunctionField label="" render={NameCell} />
      <EmailField source="email" emptyText="—" />
      <TextField source="phone" emptyText="—" />
      <TextField source="role" emptyText="Driver" />
      <DateField source="member_since" label="Member since" emptyText="—" />
    </SimpleShowLayout>
  </Show>
);
