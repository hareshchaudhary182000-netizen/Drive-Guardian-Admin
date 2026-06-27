import {
  ChipField,
  DateField,
  FunctionField,
  List,
  ReferenceField,
  Show,
  SimpleShowLayout,
  TextField,
  TextInput,
  SelectInput,
  SearchInput,
} from 'react-admin';
import { Box, Card, Chip, Rating, Stack, Typography } from '@mui/material';
import FeedbackRoundedIcon from '@mui/icons-material/FeedbackRounded';
import { Datagrid } from 'react-admin';
import { downloadSheet, fmtDateTime, tone } from '../exportUtils';

/** Clean, branded export matching the Feedback table (resolves user name+email). */
const exportFeedback = async (records: any[], fetchRelatedRecords: any) => {
  const users = await fetchRelatedRecords(records, 'user_id', 'profiles');
  await downloadSheet({
    filename: 'feedback',
    sheetName: 'Feedback',
    title: 'DriveGuardian · Feedback',
    columns: [
      {
        header: 'Category',
        width: 16,
        tone: (v: string) =>
          v === 'Report Issue' ? tone.danger : v === 'Suggest Feature' ? tone.info : tone.brand,
      },
      { header: 'Message', width: 60 },
      { header: 'From', width: 20 },
      { header: 'Email', width: 28 },
      {
        header: 'Rating',
        width: 12,
        align: 'center',
        tone: (v: string) => {
          const n = parseInt(String(v), 10);
          if (isNaN(n)) return undefined;
          return n >= 4 ? tone.success : n === 3 ? tone.warning : tone.danger;
        },
      },
      { header: 'Received', width: 22 },
    ],
    rows: records.map(r => [
      r.category || 'General',
      r.message || '',
      users[r.user_id]?.name || 'Unknown',
      users[r.user_id]?.email || '',
      r.rating ? `${r.rating} of 5` : '',
      fmtDateTime(r.created_at),
    ]),
  });
};

export const feedbackIcon = FeedbackRoundedIcon;

const filters = [
  <SearchInput source="message@ilike" alwaysOn placeholder="Search message" key="q" />,
  <SelectInput
    source="category"
    key="cat"
    choices={[
      { id: 'Report Issue', name: 'Report Issue' },
      { id: 'Suggest Feature', name: 'Suggest Feature' },
      { id: 'General', name: 'General' },
    ]}
  />,
  <TextInput source="user_id" label="User ID" key="uid" />,
];

const categoryColor = (c?: string) =>
  c === 'Report Issue' ? 'error' : c === 'Suggest Feature' ? 'info' : 'default';

export const FeedbackList = () => (
  <List
    filters={filters}
    sort={{ field: 'created_at', order: 'DESC' }}
    perPage={25}
    title="Feedback Inbox"
    exporter={exportFeedback}
  >
    <Datagrid rowClick="show" bulkActionButtons={false}>
      <FunctionField
        label="Category"
        render={(r: any) => (
          <Chip
            size="small"
            label={r.category || 'General'}
            color={categoryColor(r.category) as any}
            variant="outlined"
          />
        )}
      />
      <FunctionField
        label="Message"
        render={(r: any) => (
          <Typography variant="body2" sx={{ maxWidth: 460 }} noWrap>
            {r.message}
          </Typography>
        )}
      />
      <ReferenceField
        label="From"
        source="user_id"
        reference="profiles"
        link={false}
        emptyText="—"
      >
        <TextField source="name" />
      </ReferenceField>
      <FunctionField
        label="Rating"
        render={(r: any) =>
          r.rating ? <Rating value={r.rating} readOnly size="small" /> : '—'
        }
      />
      <DateField source="created_at" label="Received" showTime />
    </Datagrid>
  </List>
);

export const FeedbackShow = () => (
  <Show title="Feedback">
    <SimpleShowLayout>
      <Box sx={{ maxWidth: 720 }}>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <ChipField source="category" />
        </Stack>
      </Box>
      <FunctionField
        label="Message"
        render={(r: any) => (
          <Card sx={{ p: 2.5, bgcolor: 'action.hover', boxShadow: 'none' }}>
            <Typography sx={{ whiteSpace: 'pre-wrap' }}>{r.message}</Typography>
          </Card>
        )}
      />
      <FunctionField
        label="Rating"
        render={(r: any) =>
          r.rating ? <Rating value={r.rating} readOnly /> : 'Not rated'
        }
      />
      <Typography variant="overline" color="text.secondary">
        Submitted by
      </Typography>
      <ReferenceField source="user_id" reference="profiles" link="show" emptyText="Unknown user">
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField label="Contact" source="user_id" reference="profiles" link={false} emptyText="—">
        <TextField source="phone" />
      </ReferenceField>
      <DateField source="created_at" label="Received" showTime />
    </SimpleShowLayout>
  </Show>
);
