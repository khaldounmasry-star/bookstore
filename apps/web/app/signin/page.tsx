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

import { usersApi } from '../../lib/api';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiClient } from '../../lib/api/client';
import { Role } from '../../types';
import { ApiError } from '../../lib/api/error';

export default function SignInPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [passwordError, setPasswordError] = useState<string | undefined>(undefined);

  const router = useRouter();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmailError(undefined);
    setPasswordError(undefined);
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmailError(undefined);
    setPasswordError(undefined);
    setPassword(e.target.value);
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      const { token: apiToken, role } = await usersApi.login({ email, password });
      const client = new ApiClient();
      client.setToken(apiToken);
      localStorage.setItem('user_status', apiToken);
      router.push(role === Role.USER ? '/' : '/admin');
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.isValidationError()) {
          error.issues?.forEach(issue => {
            if (issue.path === 'email') setEmailError(issue.message);
            if (issue.path === 'password') setPasswordError(issue.message);
          });
          return;
        }
        if (error.isAuthorisationError()) {
          if (error.message.includes('email')) {
            setEmailError('Invalid email');
          } else {
            setPasswordError('Invalid password');
          }
          return;
        }
      }
      throw error;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: { sm: 'flex-start', md: 'center' },
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
        overflowY: 'auto'
      }}
    >
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
            error={Boolean(emailError)}
            label="Email address"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleEmailChange}
            helperText={emailError || ''}
          />
          <TextField
            error={Boolean(passwordError)}
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handlePasswordChange}
            helperText={passwordError || ''}
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
            {/* <Link href="#">
              <Typography color="primary" variant="body2">
                Forgot password
              </Typography>
            </Link> */}
          </Box>

          <Button fullWidth variant="contained" size="large" onClick={handleSubmit}>
            Sign in
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
    </Box>
  );
}
