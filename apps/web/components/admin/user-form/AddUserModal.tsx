'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack
} from '@mui/material';
import { useState, FC } from 'react';
import { User } from '../../../types';

type AddUserModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<User, 'id' | 'role'> & { password: string }) => Promise<void> | void;
};

export const AddUserModal: FC<AddUserModalProps> = ({ open, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit(form);
      setForm({ firstName: '', lastName: '', email: '', password: '' });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Add New User</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} mt={1}>
          <TextField
            name="firstName"
            label="First Name"
            value={form.firstName}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            name="lastName"
            label="Last Name"
            value={form.lastName}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            name="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            required
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Adding...' : 'Add User'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
