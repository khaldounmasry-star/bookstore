'use client';

import { Box, Button, TextField, Typography, Divider, Paper } from '@mui/material';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { usersApi } from '../../lib/api';

export default function SignUpPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');

  const router = useRouter();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setLastName(e.target.value);
  };

  const handleSubmit = async (): Promise<void> => {
    await usersApi.register({
      firstName,
      lastName,
      email,
      password
    });
    router.push('/signin');
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
          Thank you for registering
        </Typography>

        <Box component="form" noValidate>
          <TextField
            label="First name"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleFirstNameChange}
          />
          <TextField
            label="Last name"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleLastNameChange}
          />
          <TextField
            label="Email address"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleEmailChange}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handlePasswordChange}
          />

          <Box sx={{ mt: 1, mb: 2 }} />

          <Button fullWidth variant="contained" size="large" onClick={handleSubmit}>
            Sign up
          </Button>

          <Divider sx={{ my: 2 }}>or</Divider>

          <Typography variant="body2" align="center" mt={3}>
            Already with us?{' '}
            <Link href="/signin" style={{ textDecoration: 'none', color: '#2563EB' }}>
              Sign in
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
