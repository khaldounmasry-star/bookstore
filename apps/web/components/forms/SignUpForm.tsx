'use client';

import Link from 'next/link';
import { Box, Button, TextField, Typography, Divider, Paper } from '@mui/material';
import { useSignUpForm } from '../../hooks/useSignUpForm';

export const SignUpForm = () => {
  const {
    values: { email, password, firstName, lastName },
    errors: { emailError, passwordError, firstNameError, lastNameError },
    isSubmitting,
    handlers: { setEmail, setPassword, setFirstName, setLastName, handleSubmit }
  } = useSignUpForm();

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
        Thank you for registering
      </Typography>

      <Box component="form" noValidate>
        <TextField
          label="First name"
          fullWidth
          margin="normal"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          error={!!firstNameError}
          helperText={firstNameError}
        />
        <TextField
          label="Last name"
          fullWidth
          margin="normal"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          error={!!lastNameError}
          helperText={lastNameError}
        />
        <TextField
          label="Email address"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={e => setEmail(e.target.value)}
          error={!!emailError}
          helperText={emailError}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={e => setPassword(e.target.value)}
          error={!!passwordError}
          helperText={passwordError}
        />

        <Box sx={{ mt: 1, mb: 2 }} />

        <Button
          fullWidth
          variant="contained"
          size="large"
          disabled={isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? 'Signing up…' : 'Sign up'}
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
  );
};
