import { useState } from 'react';
import { useLogin, useNotify } from 'react-admin';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';

/**
 * Branded split-screen login: a violet→indigo hero on the left, a clean sign-in
 * card on the right. Matches the DriveGuardian mobile app's identity.
 */
export const LoginPage = () => {
  const login = useLogin();
  const notify = useNotify();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ username: email, password });
    } catch (err) {
      notify((err as Error).message || 'Invalid credentials', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Brand hero */}
      <Box
        sx={{
          flex: 1.1,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 7,
          color: '#fff',
          background:
            'radial-gradient(1200px 500px at -10% -10%, #8E79FF 0%, transparent 50%), linear-gradient(135deg, #7C5CFC 0%, #5B5FE9 55%, #4B45C6 100%)',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: 2.5,
              bgcolor: 'rgba(255,255,255,0.18)',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <ShieldRoundedIcon />
          </Box>
          <Typography variant="h5" fontWeight={800}>
            DriveGuardian
          </Typography>
        </Stack>

        <Box>
          <Typography variant="h2" sx={{ fontSize: 44, lineHeight: 1.1, mb: 2 }}>
            Admin
            <br />
            Control Center
          </Typography>
          <Typography sx={{ opacity: 0.9, maxWidth: 420, fontSize: 17 }}>
            Monitor feedback, drivers, partners and safe-driving activity — all
            in one place.
          </Typography>
        </Box>

        <Typography sx={{ opacity: 0.7, fontSize: 13 }}>
          © DriveGuardian · Safer roads, together.
        </Typography>
      </Box>

      {/* Sign-in card */}
      <Box
        sx={{
          flex: 1,
          display: 'grid',
          placeItems: 'center',
          bgcolor: '#F4F5FC',
          p: 3,
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 400, p: 4 }}>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Welcome back 👋
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Sign in to the admin dashboard
          </Typography>

          <form onSubmit={submit}>
            <Stack spacing={2.2}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                autoFocus
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ py: 1.3, mt: 1 }}
              >
                {loading ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  'Sign in'
                )}
              </Button>
            </Stack>
          </form>
        </Card>
      </Box>
    </Box>
  );
};
