import { Menu, useGetIdentity, useSidebarState } from 'react-admin';
import { Avatar, Box, Card, Stack, Typography } from '@mui/material';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';

/** Branded sidebar: logo, a user profile card, then grouped navigation.
 *  Adapts gracefully when the sidebar is collapsed to an icon rail. */
export const MyMenu = () => {
  const { identity } = useGetIdentity();
  const [open] = useSidebarState();
  const name = identity?.fullName || 'Admin';

  return (
    <Menu
      sx={{
        pt: 0,
        overflowX: 'hidden',
        ...(!open && {
          '& .RaMenuItemLink-root': {
            marginInline: '8px',
            paddingInline: '0',
            justifyContent: 'center',
            boxShadow: 'none',
          },
          '& .RaMenuItemLink-icon': { minWidth: 'unset' },
        }),
      }}
    >
      {/* Logo */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.2}
        sx={{ px: open ? 2 : 0, py: 2.2, justifyContent: open ? 'flex-start' : 'center' }}
      >
        <Box
          sx={{
            width: 38,
            height: 38,
            flexShrink: 0,
            borderRadius: 2.5,
            background: 'linear-gradient(135deg,#7C5CFC,#5B5FE9)',
            color: '#fff',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <ShieldRoundedIcon fontSize="small" />
        </Box>
        {open && (
          <Box sx={{ minWidth: 0 }}>
            <Typography fontWeight={800} lineHeight={1.1} fontSize={15} noWrap>
              DriveGuardian
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              Admin Console
            </Typography>
          </Box>
        )}
      </Stack>

      {/* Profile card (only when expanded) */}
      {open && (
        <Card sx={{ mx: 1.5, mb: 1.5, p: 1.4, boxShadow: 'none', bgcolor: 'rgba(91,95,233,0.05)' }}>
          <Stack direction="row" alignItems="center" spacing={1.2}>
            <Avatar src={identity?.avatar} sx={{ width: 38, height: 38, bgcolor: 'primary.main', fontWeight: 700 }}>
              {name.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography fontWeight={700} fontSize={14} noWrap>
                {name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Administrator
              </Typography>
            </Box>
          </Stack>
        </Card>
      )}

      {open && (
        <Typography variant="overline" sx={{ px: 2.5, color: 'text.secondary', opacity: 0.7 }}>
          Overview
        </Typography>
      )}
      <Menu.DashboardItem />

      {open && (
        <Typography variant="overline" sx={{ px: 2.5, mt: 1.2, color: 'text.secondary', opacity: 0.7 }}>
          Manage
        </Typography>
      )}
      <Menu.ResourceItem name="feedback" />
      <Menu.ResourceItem name="profiles" />
      <Menu.ResourceItem name="partners" />
      <Menu.ResourceItem name="activity_logs" />
      <Menu.ResourceItem name="reports" />
      <Menu.ResourceItem name="ads" />
      <Menu.ResourceItem name="notifications" />
    </Menu>
  );
};
