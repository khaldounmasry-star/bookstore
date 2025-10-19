'use client';

import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { FC, useState } from 'react';
import { UsersTableProps, Role, User } from '../../../types';
import { usersApi } from '../../../lib';
import { useRouter } from 'next/navigation';
import { ConfirmationModal } from '../confirmation-modal';
import { ActionNotification } from '../action-notification';

export const UsersTable: FC<UsersTableProps> = ({ users }) => {
  const router = useRouter();

  const [success, setSuccess] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const openConfirmDialog = (user: User) => {
    setSelectedUser(user);
    setConfirmOpen(true);
  };

  const closeConfirmDialog = () => {
    setConfirmOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    setLoading(true);
    try {
      await usersApi.deleteUser(Number(selectedUser.id));
      /*
        Added a short delay to handle SSR caching and client–server synchronization.
        The parent (SSR) was re-fetching users right after deletion, but the response still contained
        the deleted user because the server was serving a cached fetch result.
        This timeout gives the backend enough time to invalidate the cache and ensure the refreshed data
        reflects the deletion correctly.
        TODO: refactor
      */
      setTimeout(() => {
        setSuccess(true);
        router.refresh();
      }, 200);
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
      closeConfirmDialog();
    }
  };

  return (
    <Box sx={{ marginTop: 3 }}>
      <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Table aria-label="users table">
          <TableHead sx={{ bgcolor: 'grey.100' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>First Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Last Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map(user => (
                <TableRow
                  key={user.id}
                  hover
                  sx={{
                    transition: 'background-color 0.2s ease',
                    '&:hover': { bgcolor: 'grey.50' }
                  }}
                >
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  {user.role !== Role.SUPER_ADMIN && (
                    <TableCell align="center">
                      <Tooltip title={`Delete ${user.firstName}`}>
                        <IconButton
                          color="error"
                          size="medium"
                          onClick={() => openConfirmDialog(user)}
                        >
                          <DeleteIcon fontSize="medium" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <ConfirmationModal
        open={confirmOpen}
        title="Confirm Deletion"
        message={
          <>
            Are you sure you want to delete user:{' '}
            <b>
              {selectedUser?.firstName} {selectedUser?.lastName}
            </b>
            ?
          </>
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={loading}
        onConfirm={handleConfirmDelete}
        onClose={closeConfirmDialog}
      />
      {success && (
        <ActionNotification
          success={success}
          callbacks={[() => setSuccess(false), () => setSelectedUser(null)]}
          successMessage={`User ${selectedUser?.firstName} deleted successfully!`}
        />
      )}
    </Box>
  );
};
