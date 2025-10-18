'use client';

import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  Divider,
  Paper
} from '@mui/material';
import Link from 'next/link';
import { useSignInForm } from '../../hooks/useSignInForm';

export const SignInForm = () => {
  const {
    values: { email, password },
    errors: { emailError, passwordError },
    isSubmitting,
    handlers: { setEmail, setPassword, handleSubmit }
  } = useSignInForm();

  return (
    <Paper
      elevation={1}
      sx={{
        p: 5,
        width: '100%',
        maxWidth: 600,
        borderRadius: 4
      }}
    >
      <Typography variant="body1" color="text.secondary" mb={1}>
        Please enter your details
      </Typography>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Welcome back
      </Typography>

      <Box component="form" noValidate>
        <TextField
          error={!!emailError}
          label="Email address"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={e => setEmail(e.target.value)}
          helperText={emailError}
        />
        <TextField
          error={!!passwordError}
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={e => setPassword(e.target.value)}
          helperText={passwordError}
        />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: 1,
            mb: 2
          }}
        >
          <FormControlLabel control={<Checkbox />} label="Remember for 30 days" />
        </Box>

        <Button
          fullWidth
          variant="contained"
          size="large"
          disabled={isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>

        <Divider sx={{ my: 2 }}>or</Divider>

        <Typography variant="body2" align="center" mt={3}>
          Don’t have an account?{' '}
          <Link href="/signup" style={{ textDecoration: 'none', color: '#2563EB' }}>
            Sign up
          </Link>
        </Typography>
      </Box>
    </Paper>
  );
};
