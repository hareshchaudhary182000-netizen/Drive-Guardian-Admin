import { useEffect, useState } from 'react';
import { useGetIdentity } from 'react-admin';
import { Box, Card, Chip, Stack, Typography, useTheme } from '@mui/material';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import FeedbackRoundedIcon from '@mui/icons-material/FeedbackRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import HandshakeRoundedIcon from '@mui/icons-material/HandshakeRounded';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { supabaseClient } from '../supabase';
import { StatCard } from './StatCard';
import { Reveal } from '../components/Reveal';
import { AnimatedNumber } from '../components/AnimatedNumber';

const C = {
  indigo: '#5B5FE9',
  violet: '#7C5CFC',
  rose: '#FF5A72',
  sky: '#3B82F6',
  amber: '#F59E0B',
  emerald: '#10B981',
};

const KPI = {
  indigo: { gradient: 'linear-gradient(135deg,#7C5CFC,#5B5FE9)', glow: 'rgba(91,95,233,0.45)' },
  violet: { gradient: 'linear-gradient(135deg,#9B7BFF,#7C5CFC)', glow: 'rgba(124,92,252,0.45)' },
  rose: { gradient: 'linear-gradient(135deg,#FF8A98,#FF5A72)', glow: 'rgba(255,90,114,0.45)' },
  sky: { gradient: 'linear-gradient(135deg,#5BA8FF,#3B82F6)', glow: 'rgba(59,130,246,0.45)' },
  amber: { gradient: 'linear-gradient(135deg,#FBBF5B,#F59E0B)', glow: 'rgba(245,158,11,0.45)' },
  emerald: { gradient: 'linear-gradient(135deg,#34D399,#10B981)', glow: 'rgba(16,185,129,0.45)' },
};

const PIE_COLORS = ['#5B5FE9', '#7C5CFC', '#3B82F6', '#10B981', '#F59E0B', '#FF5A72'];
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const EVENT_LABELS: Record<string, string> = {
  message_sent: 'Messages',
  message: 'Messages',
  message_opened: 'Msg opened',
  call_answered: 'Answered',
  call_rejected: 'Rejected',
  call_missed: 'Missed',
  call_outgoing: 'Outgoing',
};

type Stats = {
  users: number;
  feedback: number;
  partners: number;
  riskWeek: number;
  reports: number;
  seatbelt: number;
};

type DayPoint = { day: string; risk: number; safe: number };
type Slice = { name: string; value: number };

async function safeCount(table: string, build?: (q: any) => any): Promise<number> {
  try {
    let q = supabaseClient.from(table).select('*', { count: 'exact', head: true });
    if (build) q = build(q);
    const { count } = await q;
    return count ?? 0;
  } catch {
    return 0;
  }
}

const cardTitle = { fontWeight: 700, fontSize: 16 } as const;
const liftCard = {
  transition: 'transform .22s ease, box-shadow .22s ease',
  '&:hover': { transform: 'translateY(-4px)' },
} as const;

export const Dashboard = () => {
  const theme = useTheme();
  const { identity } = useGetIdentity();
  const dark = theme.palette.mode === 'dark';
  const grid = dark ? '#272A47' : '#EEF0F6';
  const [stats, setStats] = useState<Stats>({
    users: 0, feedback: 0, partners: 0, riskWeek: 0, reports: 0, seatbelt: 0,
  });
  const [series, setSeries] = useState<DayPoint[]>([]);
  const [breakdown, setBreakdown] = useState<Slice[]>([]);

  useEffect(() => {
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();

    (async () => {
      const [users, feedback, partners, riskWeek, reports, seatbelt] =
        await Promise.all([
          safeCount('profiles'),
          safeCount('feedback'),
          safeCount('partners'),
          safeCount('activity_logs', (q) =>
            q.eq('is_risk', true).gte('occurred_at', weekAgo)),
          safeCount('reports'),
          safeCount('seatbelt_checks'),
        ]);
      setStats({ users, feedback, partners, riskWeek, reports, seatbelt });

      try {
        const { data } = await supabaseClient
          .from('activity_logs')
          .select('is_risk, occurred_at')
          .gte('occurred_at', weekAgo);
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        start.setDate(start.getDate() - 6);
        const pts: DayPoint[] = Array.from({ length: 7 }, (_, i) => {
          const d = new Date(start);
          d.setDate(start.getDate() + i);
          return { day: DAY_LABELS[d.getDay()], risk: 0, safe: 0 };
        });
        for (const r of data ?? []) {
          const idx = Math.floor(
            (new Date(r.occurred_at).getTime() - start.getTime()) / 86400000,
          );
          if (idx >= 0 && idx < 7) pts[idx][r.is_risk ? 'risk' : 'safe'] += 1;
        }
        setSeries(pts);
      } catch {
        setSeries([]);
      }

      try {
        const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString();
        const { data } = await supabaseClient
          .from('activity_logs')
          .select('event_type')
          .gte('occurred_at', monthAgo);
        const counts: Record<string, number> = {};
        for (const r of data ?? []) {
          const label = EVENT_LABELS[r.event_type] ?? r.event_type ?? 'Other';
          counts[label] = (counts[label] ?? 0) + 1;
        }
        setBreakdown(
          Object.entries(counts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value),
        );
      } catch {
        setBreakdown([]);
      }
    })();
  }, []);

  const firstName = (identity?.fullName || 'Admin').split(' ')[0];
  const totalSafe = series.reduce((a, s) => a + s.safe, 0);
  const totalRisk = series.reduce((a, s) => a + s.risk, 0);
  const totalEvents = totalSafe + totalRisk;
  const safeRate = totalEvents ? Math.round((totalSafe / totalEvents) * 100) : 100;

  return (
    <Box sx={{ mt: 1 }}>
      {/* Gradient hero */}
      <Reveal>
      <Card
        sx={{
          p: { xs: 3, md: 3.5 },
          mb: 3,
          color: '#fff',
          border: dark ? '1px solid #2A2D52' : 'none',
          position: 'relative',
          overflow: 'hidden',
          background: dark
            ? 'radial-gradient(760px 280px at 92% -40%, rgba(124,92,252,0.30) 0%, transparent 55%), linear-gradient(120deg,#1A1D3A 0%,#22254A 55%,#2A2856 100%)'
            : 'radial-gradient(900px 320px at 88% -30%, rgba(255,255,255,0.26) 0%, transparent 55%), linear-gradient(120deg,#7C5CFC 0%,#5B5FE9 55%,#4B45C6 100%)',
          boxShadow: dark
            ? '0 16px 40px -22px rgba(0,0,0,0.75)'
            : '0 20px 50px -22px rgba(91,95,233,0.55)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            bottom: -70,
            left: -30,
            width: 220,
            height: 220,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.10)',
          }}
        />
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          gap={1.5}
          sx={{ position: 'relative' }}
        >
          <Box>
            <Typography variant="h4" fontWeight={800}>
              Welcome back, {firstName} 👋
            </Typography>
            <Typography sx={{ opacity: 0.92, mt: 0.5, fontSize: 15 }}>
              Here's what's happening across DriveGuardian today.
            </Typography>
          </Box>
          <Chip
            label={
              <Stack direction="row" alignItems="center" spacing={0.8}>
                <Box className="dg-pulse" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#7BFFB0' }} />
                <span>Live data</span>
              </Stack>
            }
            sx={{
              bgcolor: 'rgba(255,255,255,0.18)',
              color: '#fff',
              fontWeight: 700,
              height: 36,
              backdropFilter: 'blur(6px)',
            }}
          />
        </Stack>
      </Card>
      </Reveal>

      {/* KPI cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 2,
          mb: 3,
        }}
      >
        {[
          <StatCard key="d" label="Total Drivers" value={<AnimatedNumber value={stats.users} />} icon={<GroupRoundedIcon />} {...KPI.indigo} />,
          <StatCard key="f" label="Feedback" value={<AnimatedNumber value={stats.feedback} />} icon={<FeedbackRoundedIcon />} {...KPI.violet} hint="all time" />,
          <StatCard key="r" label="Risk Events" value={<AnimatedNumber value={stats.riskWeek} />} icon={<WarningRoundedIcon />} {...KPI.rose} hint="this week" />,
          <StatCard key="p" label="Partners" value={<AnimatedNumber value={stats.partners} />} icon={<HandshakeRoundedIcon />} {...KPI.sky} />,
          <StatCard key="rp" label="Reports" value={<AnimatedNumber value={stats.reports} />} icon={<AssessmentRoundedIcon />} {...KPI.amber} />,
          <StatCard key="s" label="Seatbelt Checks" value={<AnimatedNumber value={stats.seatbelt} />} icon={<VerifiedUserRoundedIcon />} {...KPI.emerald} />,
        ].map((card, i) => (
          <Reveal key={i} delay={120 + i * 80} sx={{ display: 'flex' }}>
            {card}
          </Reveal>
        ))}
      </Box>

      {/* Charts row */}
      <Stack direction={{ xs: 'column', lg: 'row' }} gap={2} sx={{ mb: 2 }}>
        <Card className="dg-fade" sx={{ p: 3, flex: 2, minWidth: 320, animationDelay: '500ms', ...liftCard }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
            <Typography sx={cardTitle}>Activity — last 7 days</Typography>
            <Stack direction="row" spacing={1.5}>
              <Legend color={C.emerald} label="Safe" />
              <Legend color={C.rose} label="Risk" />
            </Stack>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Safe vs risk events per day
          </Typography>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={series}>
              <defs>
                <linearGradient id="gRisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.rose} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={C.rose} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gSafe" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.emerald} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={C.emerald} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} allowDecimals={false} width={28} fontSize={12} />
              <Tooltip contentStyle={tooltipStyle(dark)} />
              <Area type="monotone" dataKey="safe" stroke={C.emerald} strokeWidth={2.5} fill="url(#gSafe)" name="Safe" />
              <Area type="monotone" dataKey="risk" stroke={C.rose} strokeWidth={2.5} fill="url(#gRisk)" name="Risk" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="dg-fade" sx={{ p: 3, flex: 1, minWidth: 280, animationDelay: '600ms', ...liftCard }}>
          <Typography sx={cardTitle}>Event mix</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Last 30 days
          </Typography>
          {breakdown.length === 0 ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={breakdown} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={3} stroke="none">
                  {breakdown.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle(dark)} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </Stack>

      {/* Bottom row */}
      <Stack direction={{ xs: 'column', lg: 'row' }} gap={2}>
        <Card className="dg-fade" sx={{ p: 3, flex: 1, minWidth: 300, animationDelay: '680ms', ...liftCard }}>
          <Typography sx={cardTitle}>Top event types</Typography>
          <Box sx={{ mt: 2 }}>
            {breakdown.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={breakdown.slice(0, 6)}>
                  <defs>
                    <linearGradient id="gBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7C5CFC" />
                      <stop offset="100%" stopColor="#5B5FE9" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} allowDecimals={false} width={28} fontSize={12} />
                  <Tooltip cursor={{ fill: 'rgba(91,95,233,0.06)' }} contentStyle={tooltipStyle(dark)} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="url(#gBar)" maxBarSize={46} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Box>
        </Card>

        <Card className="dg-fade" sx={{ p: 3, flex: 1, minWidth: 300, animationDelay: '760ms', ...liftCard }}>
          <Typography sx={cardTitle}>Weekly safety</Typography>
          <Typography variant="body2" color="text.secondary">
            Safe vs risk · last 7 days
          </Typography>
          <Box sx={{ position: 'relative', height: 188, mt: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={
                    totalEvents
                      ? [
                          { name: 'Safe', value: totalSafe },
                          { name: 'Risk', value: totalRisk },
                        ]
                      : [{ name: 'Safe', value: 1 }]
                  }
                  dataKey="value"
                  innerRadius={64}
                  outerRadius={86}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={totalRisk && totalSafe ? 3 : 0}
                  stroke="none"
                >
                  <Cell fill={C.emerald} />
                  <Cell fill={C.rose} />
                </Pie>
                <Tooltip contentStyle={tooltipStyle(dark)} />
              </PieChart>
            </ResponsiveContainer>
            <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontSize: 32, lineHeight: 1 }}>
                  {safeRate}%
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Safe rate
                </Typography>
              </Box>
            </Box>
          </Box>
          <Stack direction="row" spacing={1.5} justifyContent="center" sx={{ mt: 1.5 }}>
            <SafetyStat color={C.emerald} label="Safe events" value={totalSafe} />
            <SafetyStat color={C.rose} label="Risk events" value={totalRisk} />
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
};

const tooltipStyle = (dark: boolean) => ({
  borderRadius: 12,
  border: `1px solid ${dark ? '#272A47' : '#ECEDF4'}`,
  background: dark ? '#161830' : '#fff',
  boxShadow: '0 12px 30px -12px rgba(16,24,40,0.4)',
  fontSize: 13,
});

const Legend = ({ color, label }: { color: string; label: string }) => (
  <Stack direction="row" alignItems="center" spacing={0.6}>
    <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: color }} />
    <Typography variant="caption" color="text.secondary" fontWeight={600}>
      {label}
    </Typography>
  </Stack>
);

const SafetyStat = ({ color, label, value }: { color: string; label: string; value: number }) => (
  <Stack
    alignItems="center"
    sx={{ flex: 1, py: 1, borderRadius: 3, bgcolor: `${color}14` }}
  >
    <Typography variant="h4" sx={{ fontSize: 22, color }}>
      {value.toLocaleString()}
    </Typography>
    <Typography variant="caption" color="text.secondary" fontWeight={600}>
      {label}
    </Typography>
  </Stack>
);

const EmptyChart = () => (
  <Box sx={{ height: 240, display: 'grid', placeItems: 'center' }}>
    <Typography color="text.secondary">No data yet</Typography>
  </Box>
);
