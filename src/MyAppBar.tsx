import { AppBar, TitlePortal } from 'react-admin';
import { Typography } from '@mui/material';

/** Clean white top bar with the page title; user menu + theme toggle stay right. */
export const MyAppBar = () => (
  <AppBar color="default" elevation={0}>
    <TitlePortal>
      <Typography
        variant="h6"
        component="span"
        sx={{ fontWeight: 800, fontSize: 19, flex: 1 }}
        id="react-admin-title"
      />
    </TitlePortal>
  </AppBar>
);
