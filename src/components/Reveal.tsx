import { Box } from '@mui/material';
import type { SxProps } from '@mui/material';
import type { ReactNode } from 'react';

/** Fades + slides its children up on mount, with an optional stagger delay. */
export const Reveal = ({
  children,
  delay = 0,
  sx,
}: {
  children: ReactNode;
  delay?: number;
  sx?: SxProps;
}) => (
  <Box className="dg-reveal" sx={{ animationDelay: `${delay}ms`, ...sx }}>
    {children}
  </Box>
);
