import { Box, Card, Stack, Typography } from '@mui/material';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import type { ReactNode } from 'react';

type Props = {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  /** CSS gradient for the icon badge + glow accent. */
  gradient: string;
  glow: string;
  hint?: string;
};

/** A premium KPI card with a glowing gradient icon, depth and a hover lift. */
export const StatCard = ({ label, value, icon, gradient, glow, hint }: Props) => (
  <Card
    sx={{
      p: 2.75,
      flex: 1,
      minWidth: 200,
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform .22s ease, box-shadow .22s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: `0 22px 48px -18px ${glow}`,
      },
    }}
  >
    {/* soft corner glow */}
    <Box
      sx={{
        position: 'absolute',
        top: -36,
        right: -28,
        width: 120,
        height: 120,
        borderRadius: '50%',
        background: gradient,
        opacity: 0.14,
        filter: 'blur(6px)',
      }}
    />
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.8 }}>
      <Typography variant="body2" color="text.secondary" fontWeight={600}>
        {label}
      </Typography>
      <Box
        sx={{
          width: 46,
          height: 46,
          borderRadius: 3,
          background: gradient,
          color: '#fff',
          display: 'grid',
          placeItems: 'center',
          boxShadow: `0 10px 22px -8px ${glow}`,
        }}
      >
        {icon}
      </Box>
    </Stack>
    <Typography variant="h3" sx={{ fontSize: 32, lineHeight: 1.05 }}>
      {value}
    </Typography>
    {hint && (
      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
        <TrendingUpRoundedIcon sx={{ fontSize: 16, color: 'success.main' }} />
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          {hint}
        </Typography>
      </Stack>
    )}
  </Card>
);
