import type { RaThemeOptions } from 'react-admin';

/**
 * DriveGuardian Admin theme — a premium analytics dashboard look: floating
 * cards with layered depth shadows + hover lift, a soft indigo accent, gradient
 * highlights, and a rich dark mode. Inter typeface throughout.
 */
const brand = {
  indigo: '#5B5FE9',
  indigoDeep: '#4B45C6',
  violet: '#7C5CFC',
  emerald: '#10B981',
  amber: '#F59E0B',
  rose: '#FF5A72',
  sky: '#3B82F6',
  ink: '#1A1B33',
  slate: '#6B6E87',
  line: '#ECEDF4',
};

const fontStack =
  '"Inter", "Segoe UI", Roboto, -apple-system, BlinkMacSystemFont, sans-serif';

// Layered "3D" depth shadows.
const cardShadowLight =
  '0 1px 2px rgba(16,24,40,0.04), 0 6px 16px -6px rgba(16,24,40,0.10), 0 18px 40px -16px rgba(91,95,233,0.14)';
const cardShadowDark =
  '0 2px 6px rgba(0,0,0,0.45), 0 12px 30px -10px rgba(0,0,0,0.6), 0 24px 60px -24px rgba(124,92,252,0.30)';

const shared: RaThemeOptions = {
  palette: {
    primary: { main: brand.indigo, dark: brand.indigoDeep },
    secondary: { main: brand.violet },
    success: { main: brand.emerald },
    warning: { main: brand.amber },
    error: { main: brand.rose },
    info: { main: brand.sky },
  },
  typography: {
    fontFamily: fontStack,
    fontSize: 13.5,
    h1: { fontWeight: 800, letterSpacing: '-0.6px' },
    h2: { fontWeight: 800, letterSpacing: '-0.5px' },
    h3: { fontWeight: 800, letterSpacing: '-0.4px' },
    h4: { fontWeight: 800, letterSpacing: '-0.3px' },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700, fontSize: '1rem' },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    body2: { fontSize: '0.86rem' },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: 0 },
    overline: { fontWeight: 700, letterSpacing: '0.8px' },
  },
  shape: { borderRadius: 12 },
  components: {
    RaLayout: {
      styleOverrides: {
        root: { '& .RaLayout-content': { padding: 26, gap: 8 } },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }: any) => ({
          borderRadius: 18,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.palette.mode === 'dark' ? cardShadowDark : cardShadowLight,
          backgroundImage: 'none',
        }),
      },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 11, paddingInline: 18, boxShadow: 'none' },
        contained: { boxShadow: 'none' },
        containedPrimary: {
          background: `linear-gradient(135deg, ${brand.violet}, ${brand.indigo})`,
          boxShadow: '0 8px 20px -8px rgba(91,95,233,0.55)',
          '&:hover': { boxShadow: '0 10px 26px -8px rgba(91,95,233,0.7)' },
        },
        outlined: { borderColor: brand.line },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 700, borderRadius: 8 },
      },
    },
    MuiTextField: { defaultProps: { variant: 'outlined', size: 'small' } },
    MuiOutlinedInput: {
      styleOverrides: { root: { borderRadius: 11 } },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          fontSize: '0.72rem',
          textTransform: 'uppercase',
          letterSpacing: '0.4px',
          color: brand.slate,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorDefault: ({ theme }: any) => ({
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${theme.palette.divider}`,
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 4px 20px -8px rgba(0,0,0,0.6)'
              : '0 4px 20px -12px rgba(16,24,40,0.18)',
        }),
      },
    },
    RaMenuItemLink: {
      styleOverrides: {
        root: ({ theme }: any) => ({
          borderRadius: 11,
          marginInline: 12,
          marginBlock: 3,
          paddingBlock: 10,
          fontWeight: 600,
          fontSize: '0.9rem',
          color: theme.palette.text.secondary,
          transition: 'all .18s',
          '& .RaMenuItemLink-icon': { color: theme.palette.text.secondary, minWidth: 38 },
          '&:hover': {
            backgroundColor:
              theme.palette.mode === 'dark' ? 'rgba(142,146,245,0.10)' : 'rgba(91,95,233,0.07)',
            transform: 'translateX(2px)',
          },
          '&.RaMenuItemLink-active': {
            background: `linear-gradient(135deg, ${brand.violet}, ${brand.indigo})`,
            color: '#fff',
            fontWeight: 700,
            boxShadow: '0 8px 18px -8px rgba(91,95,233,0.6)',
            '& .RaMenuItemLink-icon': { color: '#fff' },
          },
        }),
      },
    },
    RaList: {
      styleOverrides: {
        root: ({ theme }: any) => ({
          '& .RaList-content': {
            borderRadius: 18,
            boxShadow: theme.palette.mode === 'dark' ? cardShadowDark : cardShadowLight,
            border: `1px solid ${theme.palette.divider}`,
            overflow: 'hidden',
          },
          '& .RaList-actions': { marginBottom: 10 },
        }),
      },
    },
    RaDatagrid: {
      styleOverrides: {
        root: ({ theme }: any) => ({
          '& .RaDatagrid-headerCell': {
            backgroundColor: theme.palette.mode === 'dark' ? '#1E2138' : '#FBFBFE',
            borderBottom: `1px solid ${theme.palette.divider}`,
          },
          '& .RaDatagrid-rowCell': {
            paddingBlock: 14,
            borderBottom: `1px solid ${theme.palette.divider}`,
          },
          '& .RaDatagrid-row': { transition: 'background-color .15s' },
          '& .RaDatagrid-row:last-child .RaDatagrid-rowCell': { borderBottom: 'none' },
          '& .RaDatagrid-row:hover': {
            backgroundColor:
              theme.palette.mode === 'dark' ? 'rgba(142,146,245,0.06)' : 'rgba(91,95,233,0.045)',
          },
        }),
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: ({ theme }: any) => ({
          border: 'none',
          borderRight: `1px solid ${theme.palette.divider}`,
        }),
      },
    },
  },
};

export const lightTheme: RaThemeOptions = {
  ...shared,
  palette: {
    ...shared.palette,
    mode: 'light',
    background: { default: '#F5F6FB', paper: '#FFFFFF' },
    text: { primary: brand.ink, secondary: brand.slate },
    divider: brand.line,
  },
};

export const darkTheme: RaThemeOptions = {
  ...shared,
  palette: {
    ...shared.palette,
    mode: 'dark',
    primary: { main: '#8E92F5' },
    secondary: { main: '#A78BFA' },
    background: { default: '#0A0B16', paper: '#161830' },
    text: { primary: '#F3F4FB', secondary: '#9DA0BC' },
    divider: '#272A47',
  },
};
