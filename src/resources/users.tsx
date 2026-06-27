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
import { downloadSheet, fmtDate, tone } from '../exportUtils';

export const usersIcon = PersonRoundedIcon;

/** Clean, branded export matching the Drivers table (no raw UUIDs). */
const exportDrivers = async (records: any[], _frr: any, dataProvider: any) => {
  const counts: Record<string, number> = {};
  try {
    const { data } = await dataProvider.getList('partners', {
      pagination: { page: 1, perPage: 2000 },
      sort: { field: 'id', order: 'ASC' },
      filter: {},
    });
    (data || []).forEach((p: any) => {
      counts[p.owner_id] = (counts[p.owner_id] || 0) + 1;
    });
  } catch {
    /* counts are best-effort */
  }
  await downloadSheet({
    filename: 'drivers',
    sheetName: 'Drivers',
    title: 'DriveGuardian · Drivers',
    columns: [
      { header: 'Name', width: 24 },
      { header: 'Email', width: 30 },
      { header: 'Phone', width: 18 },
      {
        header: 'Role',
        width: 12,
        align: 'center',
        tone: (v: string) => (v === 'admin' ? tone.brand : undefined),
      },
      { header: 'Partners', width: 11, align: 'center' },
      { header: 'Member Since', width: 16 },
    ],
    rows: records.map(r => [
      r.name || 'Driver',
      r.email || '',
      r.phone || '',
      r.role || 'Driver',
      counts[r.id] || 0,
      fmtDate(r.member_since),
    ]),
  });
};

const filters = [
  <SearchInput source="name@ilike" alwaysOn placeholder="Search name" key="q" />,
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
  <List filters={filters} sort={{ field: 'name', order: 'ASC' }} title="Drivers" exporter={exportDrivers}>
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
