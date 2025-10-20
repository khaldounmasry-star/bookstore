'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useState, FC, useEffect } from 'react';
import { UserFormErrors, UpdateUserModalProps, ExistingUserPayload, Role } from '../../../types';
import { validateUser, handleUserApiError } from '../../../lib';

export const UpdateUserModal: FC<UpdateUserModalProps> = ({
  user,
  open,
  onClose,
  onSubmit,
  setAlert
}) => {
  const { id, firstName, lastName, email, role } = user;
  const [form, setForm] = useState<ExistingUserPayload>({
    id,
    firstName,
    lastName,
    email,
    role
  });
  const [errors, setErrors] = useState<UserFormErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.name, e.target.value);
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async () => {
    const validation = validateUser({ ...form, update: true });
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setLoading(true);

    try {
      await onSubmit(form);
      setForm({ firstName: '', lastName: '', email: '', role: Role.EMPTY });
      onClose();
    } catch (error) {
      handleUserApiError(
        error,
        (field, message) => setErrors(prev => ({ ...prev, [field]: message })),
        msg => setAlert({ message: msg, severity: 'error' })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Update user: {firstName}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} mt={1}>
          <TextField
            name="firstName"
            label="First Name"
            value={form.firstName}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.firstName}
            helperText={errors.firstName}
          />
          <TextField
            name="lastName"
            label="Last Name"
            value={form.lastName}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.lastName}
            helperText={errors.lastName}
          />
          <TextField
            name="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.email}
            helperText={errors.email}
          />
          <FormControl fullWidth>
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              id="role-select"
              name="role"
              value={form.role}
              label="Role"
              onChange={handleChange}
            >
              <MenuItem value={Role.ADMIN}>{Role.ADMIN}</MenuItem>
              <MenuItem value={Role.USER}>{Role.USER}</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Update...' : 'Update User'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
