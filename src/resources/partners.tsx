import {
  Datagrid,
  DateField,
  EmailField,
  FunctionField,
  List,
  ReferenceField,
  TextField,
  SearchInput,
} from 'react-admin';
import { Chip, Stack } from '@mui/material';
import HandshakeRoundedIcon from '@mui/icons-material/HandshakeRounded';
import { downloadSheet, fmtDate } from '../exportUtils';

/** Clean, branded export matching the Partners table (resolves driver name). */
const exportPartners = async (records: any[], fetchRelatedRecords: any) => {
  const owners = await fetchRelatedRecords(records, 'owner_id', 'profiles');
  await downloadSheet({
    filename: 'partners',
    sheetName: 'Partners',
    title: 'DriveGuardian · Partners',
    columns: [
      { header: 'Partner', width: 22 },
      { header: 'Email', width: 28 },
      { header: 'Phone', width: 18 },
      { header: 'Relation', width: 14 },
      { header: 'Channels', width: 18 },
      { header: 'Driver', width: 22 },
      { header: 'Added', width: 16 },
    ],
    rows: records.map(r => [
      r.name || '',
      r.email || '',
      r.phone || '',
      r.relation || '',
      Array.isArray(r.channels) ? r.channels.join(' / ') : '',
      owners[r.owner_id]?.name || '—',
      fmtDate(r.created_at),
    ]),
  });
};

export const partnersIcon = HandshakeRoundedIcon;

const filters = [
  <SearchInput source="name@ilike" alwaysOn placeholder="Search partner" key="q" />,
];

const Channels = (r: any) => {
  const ch: string[] = Array.isArray(r.channels) ? r.channels : [];
  return (
    <Stack direction="row" spacing={0.5}>
      {ch.length === 0
        ? '—'
        : ch.map((c) => <Chip key={c} size="small" label={c} variant="outlined" />)}
    </Stack>
  );
};

export const PartnersList = () => (
  <List filters={filters} sort={{ field: 'created_at', order: 'DESC' }} title="Partners" exporter={exportPartners}>
    <Datagrid rowClick={false} bulkActionButtons={false}>
      <TextField source="name" />
      <EmailField source="email" emptyText="—" />
      <TextField source="phone" emptyText="—" />
      <TextField source="relation" emptyText="—" />
      <FunctionField label="Channels" render={Channels} />
      <ReferenceField label="Driver" source="owner_id" reference="profiles" link="show" emptyText="—">
        <TextField source="name" />
      </ReferenceField>
      <DateField source="created_at" label="Added" />
    </Datagrid>
  </List>
);
