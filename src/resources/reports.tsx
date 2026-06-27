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
import { downloadSheet, fmtDateTime, tone } from '../exportUtils';

export const reportsIcon = AssessmentRoundedIcon;

const scoreColor = (s: number) => (s >= 80 ? 'success' : s >= 50 ? 'warning' : 'error');

/** Clean, branded export matching the Reports table (resolves driver name). */
const exportReports = async (records: any[], fetchRelatedRecords: any) => {
  const users = await fetchRelatedRecords(records, 'user_id', 'profiles');
  await downloadSheet({
    filename: 'reports',
    sheetName: 'Reports',
    title: 'DriveGuardian · Reports',
    columns: [
      { header: 'Type', width: 12 },
      { header: 'Period', width: 22 },
      {
        header: 'Score',
        width: 12,
        align: 'center',
        tone: (v: string) => {
          const n = parseInt(String(v), 10);
          if (isNaN(n)) return undefined;
          return n >= 80 ? tone.success : n >= 50 ? tone.warning : tone.danger;
        },
      },
      { header: 'Events', width: 10, align: 'center' },
      { header: 'Driver', width: 22 },
      { header: 'Email', width: 28 },
      { header: 'Generated', width: 22 },
    ],
    rows: records.map(r => [
      r.type || '',
      r.period || '',
      r.score != null ? `${r.score}/100` : '',
      r.events ?? '',
      users[r.user_id]?.name || '—',
      users[r.user_id]?.email || '',
      fmtDateTime(r.created_at),
    ]),
  });
};

export const ReportsList = () => (
  <List sort={{ field: 'created_at', order: 'DESC' }} perPage={25} title="Reports" exporter={exportReports}>
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
