import {
  Datagrid,
  DateField,
  FunctionField,
  List,
  ReferenceField,
  TextField,
  SelectInput,
  BooleanInput,
} from 'react-admin';
import { Chip } from '@mui/material';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import { downloadSheet, fmtDateTime, tone } from '../exportUtils';

export const activityIcon = TimelineRoundedIcon;

const EVENT_LABELS: Record<string, string> = {
  message_sent: 'Message sent',
  message: 'Message sent',
  message_opened: 'Message opened',
  call_answered: 'Call answered',
  call_rejected: 'Call rejected',
  call_missed: 'Call missed',
  call_outgoing: 'Call made',
};

/** Clean, branded export matching the Activity table (friendly event + driver). */
const exportActivity = async (records: any[], fetchRelatedRecords: any) => {
  const users = await fetchRelatedRecords(records, 'user_id', 'profiles');
  await downloadSheet({
    filename: 'activity_logs',
    sheetName: 'Activity',
    title: 'DriveGuardian · Activity Logs',
    columns: [
      { header: 'Event', width: 20 },
      { header: 'Speed', width: 14, align: 'center' },
      {
        header: 'Status',
        width: 14,
        align: 'center',
        tone: (v: string) => (v === 'Risk' ? tone.danger : tone.success),
      },
      { header: 'Driver', width: 22 },
      { header: 'Email', width: 30 },
      { header: 'When', width: 24 },
    ],
    rows: records.map(r => [
      EVENT_LABELS[r.event_type] ?? r.event_type,
      `${Math.round(r.speed ?? 0)} km/h`,
      r.is_risk ? 'Risk' : 'Safe',
      users[r.user_id]?.name || '—',
      users[r.user_id]?.email || '',
      fmtDateTime(r.occurred_at),
    ]),
  });
};

const filters = [
  <SelectInput
    source="event_type"
    key="ev"
    alwaysOn
    choices={Object.keys(EVENT_LABELS)
      .filter((k) => k !== 'message')
      .map((id) => ({ id, name: EVENT_LABELS[id] }))}
  />,
  <BooleanInput source="is_risk" label="Risk only" key="risk" />,
];

export const ActivityList = () => (
  <List
    filters={filters}
    sort={{ field: 'occurred_at', order: 'DESC' }}
    perPage={50}
    title="Activity Logs"
    exporter={exportActivity}
  >
    <Datagrid rowClick={false} bulkActionButtons={false}>
      <FunctionField
        label="Event"
        render={(r: any) => EVENT_LABELS[r.event_type] ?? r.event_type}
      />
      <FunctionField
        label="Speed"
        render={(r: any) => `${Math.round(r.speed ?? 0)} km/h`}
      />
      <FunctionField
        label="Status"
        render={(r: any) => (
          <Chip
            size="small"
            label={r.is_risk ? 'Risk' : 'Safe'}
            color={r.is_risk ? 'error' : 'success'}
            variant={r.is_risk ? 'filled' : 'outlined'}
          />
        )}
      />
      <ReferenceField label="Driver" source="user_id" reference="profiles" link="show" emptyText="—">
        <TextField source="name" />
      </ReferenceField>
      <DateField source="occurred_at" label="When" showTime />
    </Datagrid>
  </List>
);
