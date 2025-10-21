'use client';

import { Box, Stack, Button } from '@mui/material';
import { FC } from 'react';
import { UsersManagerProps } from '../../../types';
import { UsersTable } from './UsersTable';
import { useUserUpdate } from '../../../hooks/useUserUpdate';
import { useUserDeletion } from '../../../hooks/useUserDeletion';
import { ConfirmationModal } from '../confirmation-modal';
import { ActionNotification } from '../action-notification';
import { AddUserModal, UpdateUserModal } from '../user-form';
import { useUserAddition } from '../../../hooks/useUserAddtion';

export const UsersManager: FC<UsersManagerProps> = ({ users }) => {
  const addition = useUserAddition();
  const update = useUserUpdate();
  const deletion = useUserDeletion();

  return (
    <Box sx={{ mt: 3 }}>
      <Stack direction="row" justifyContent="flex-end" mb={3}>
        <Button variant="contained" color="primary" onClick={() => addition.setOpen(true)}>
          Add User
        </Button>
      </Stack>

      <UsersTable
        users={users}
        onEdit={update.openUpdateDialog}
        onDelete={deletion.openConfirmDialog}
      />

      {update.selectedUser && (
        <UpdateUserModal
          user={update.selectedUser}
          open={update.editOpen}
          onClose={update.closeUpdateDialog}
          onSubmit={update.handleUpdateUser}
          setAlert={update.setAlert}
        />
      )}

      <ConfirmationModal
        open={deletion.confirmOpen}
        title="Confirm Deletion"
        message={
          <>
            Are you sure you want to delete user:{' '}
            <b>
              {deletion.selectedUser?.firstName} {deletion.selectedUser?.lastName}
            </b>
            ?
          </>
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deletion.loading}
        onConfirm={deletion.handleConfirmDelete}
        onClose={deletion.closeConfirmDialog}
      />

      <AddUserModal
        open={addition.open}
        onClose={() => addition.setOpen(false)}
        onSubmit={addition.handleAddUser}
        setAlert={addition.setAlert}
      />

      {(addition.success || addition.alert) && (
        <ActionNotification
          success={addition.success}
          callbacks={addition.resetAddNotifications()}
          successMessage={`Admin ${addition.createdName} added successfully!`}
          alert={addition.alert}
        />
      )}

      {(update.success || update.alert) && (
        <ActionNotification
          success={update.success}
          callbacks={update.resetUpdateNotifications()}
          successMessage={`User ${update.selectedUser?.firstName} updated successfully!`}
          alert={update.alert}
        />
      )}

      {(deletion.success || deletion.alert) && (
        <ActionNotification
          success={deletion.success}
          callbacks={deletion.resetDeleteNotifications()}
          successMessage={`User ${deletion.selectedUser?.firstName} deleted successfully!`}
          alert={deletion.alert}
        />
      )}
    </Box>
  );
};
