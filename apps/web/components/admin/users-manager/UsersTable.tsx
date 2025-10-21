'use client';

import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
  IconButton,
  Tooltip,
  Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { FC } from 'react';
import { User, Role } from '../../../types';

interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export const UsersTable: FC<UsersTableProps> = ({ users, onEdit, onDelete }) => (
  <TableContainer component={Paper}>
    <Table sx={{ minWidth: 650 }} aria-label="Users data table">
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
              <TableCell align="center">
                {user.role !== Role.SUPER_ADMIN ? (
                  <>
                    <Tooltip title={`Edit ${user.firstName}`}>
                      <IconButton color="info" size="medium" onClick={() => onEdit(user)}>
                        <EditIcon fontSize="medium" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={`Delete ${user.firstName}`}>
                      <IconButton color="error" size="medium" onClick={() => onDelete(user)}>
                        <DeleteIcon fontSize="medium" />
                      </IconButton>
                    </Tooltip>
                  </>
                ) : (
                  <Box sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
                    <Tooltip title="Action not allowed">
                      <DoDisturbIcon fontSize="medium" />
                    </Tooltip>
                  </Box>
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </TableContainer>
);
