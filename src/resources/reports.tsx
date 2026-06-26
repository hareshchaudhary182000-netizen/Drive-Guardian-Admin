import {
  Datagrid,
  DateField,
  FunctionField,
  List,
  NumberField,
  ReferenceField,
  TextField,
} from 'react-admin';
import { Chip } from '@mui/material';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';

export const reportsIcon = AssessmentRoundedIcon;

const scoreColor = (s: number) => (s >= 80 ? 'success' : s >= 50 ? 'warning' : 'error');

export const ReportsList = () => (
  <List sort={{ field: 'created_at', order: 'DESC' }} perPage={25} title="Reports">
    <Datagrid rowClick={false} bulkActionButtons={false}>
      <TextField source="type" label="Type" emptyText="—" />
      <TextField source="period" label="Period" emptyText="—" />
      <FunctionField
        label="Score"
        render={(r: any) =>
          r.score != null ? (
            <Chip size="small" label={`${r.score}/100`} color={scoreColor(r.score) as any} />
          ) : (
            '—'
          )
        }
      />
      <NumberField source="events" label="Events" emptyText="—" />
      <ReferenceField label="Driver" source="user_id" reference="profiles" link="show" emptyText="—">
        <TextField source="name" />
      </ReferenceField>
      <DateField source="created_at" label="Generated" showTime />
    </Datagrid>
  </List>
);
