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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { FC } from 'react';
import { UsersTableProps, User, Role } from '../../../types';

const handleDelete = (user: User) => user;
const handleEdit = (user: User) => user;

export const UsersTable: FC<UsersTableProps> = ({ users }) => {
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
                  <TableCell colSpan={user.role === Role.SUPER_ADMIN ? 2 : 1}>
                    {user.role}
                  </TableCell>
                  {user.role !== Role.SUPER_ADMIN && (
                    <TableCell align="center">
                      <Tooltip title={`Edit ${user.firstName}`}>
                        <IconButton color="primary" size="medium" onClick={() => handleEdit(user)}>
                          <EditIcon fontSize="medium" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={`Delete ${user.firstName}`}>
                        <IconButton color="error" size="medium" onClick={() => handleDelete(user)}>
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
    </Box>
  );
};
