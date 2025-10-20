'use client';

import {
  Box,
  Stack,
  Typography,
  Card,
  CardMedia,
  CardActions,
  TextField,
  Button
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Cover, CoverListProps } from '../../../types';
import { useCoverUpdate } from '../../../hooks/useCoverUpdate';
import { useCoverDeletion } from '../../../hooks/useCoverDeletion';
import { ConfirmationModal } from '../confirmation-modal';
import { ActionNotification } from '../action-notification';

export const CoversList = ({ books, selectedBookId }: CoverListProps) => {
  const [covers, setCovers] = useState<Cover[]>([]);

  useEffect(() => {
    const selectedBook = books.find(b => b.id === selectedBookId);
    setCovers(selectedBook?.covers ?? []);
  }, [selectedBookId, books]);

  const {
    updatingId,
    handleImageChange,
    handleUpdate,
    alert,
    success,
    resetUpdateNotifications,
    invalidMap
  } = useCoverUpdate(setCovers);

  const {
    confirmOpen,
    loading,
    selectedCover,
    successDelete,
    alertDelete,
    openConfirmDialog,
    closeConfirmDialog,
    handleConfirmDelete,
    resetDeleteNotifications
  } = useCoverDeletion(setCovers);

  return (
    <Box>
      {covers.length === 0 ? (
        <Typography color="text.secondary">No covers found for this book.</Typography>
      ) : (
        <Stack spacing={2}>
          {covers.map(cover => (
            <Card
              key={cover.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                flexWrap: 'wrap'
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box>
                  {cover.imageUrl ? (
                    <CardMedia
                      component="img"
                      src={cover.imageUrl}
                      alt={`Cover ${cover.id}`}
                      sx={{
                        width: 120,
                        height: 160,
                        objectFit: 'cover',
                        borderRadius: 2
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 120,
                        height: 160,
                        borderRadius: 2,
                        bgcolor: 'grey.100',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography variant="body2" color="text.secondary" textAlign="center">
                        Insert an image URL
                      </Typography>
                    </Box>
                  )}
                </Box>
                <TextField
                  label="Image URL"
                  variant="outlined"
                  value={cover.imageUrl}
                  onChange={e => handleImageChange(cover.id, e.target.value)}
                  error={!!invalidMap[cover.id]}
                  helperText={invalidMap[cover.id] || ' '}
                  sx={{ minWidth: 400 }}
                />
              </Stack>

              <CardActions>
                <Button
                  variant="outlined"
                  color="primary"
                  disabled={updatingId === cover.id}
                  onClick={() => handleUpdate(cover)}
                >
                  Update
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  disabled={loading}
                  onClick={() => openConfirmDialog(cover)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          ))}
        </Stack>
      )}
      <ConfirmationModal
        open={confirmOpen}
        title="Confirm Deletion"
        message={
          <>
            Are you sure you want to delete this cover? <br />
            <strong>Cover ID:</strong> {selectedCover?.id}
          </>
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={loading}
        onConfirm={handleConfirmDelete}
        onClose={closeConfirmDialog}
      />
      {(success || alert) && (
        <ActionNotification
          success={success}
          callbacks={resetUpdateNotifications()}
          successMessage="Cover updated successfully!"
          alert={alert}
        />
      )}
      {(successDelete || alertDelete) && (
        <ActionNotification
          success={successDelete}
          callbacks={resetDeleteNotifications()}
          successMessage={`Cover #${selectedCover?.id} deleted successfully!`}
          alert={alertDelete}
        />
      )}
    </Box>
  );
};
