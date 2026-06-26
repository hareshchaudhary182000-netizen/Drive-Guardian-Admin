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
  <List filters={filters} sort={{ field: 'created_at', order: 'DESC' }} title="Partners">
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
