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
