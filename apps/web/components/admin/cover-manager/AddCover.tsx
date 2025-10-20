'use client';

import { FC } from 'react';
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
import { useCoverAddition } from '../../../hooks/useCoverAddition';
import { ActionNotification } from '../action-notification';
import { AddCoverFormProps } from '../../../types';

export const AddCover: FC<AddCoverFormProps> = ({ selectedBookId }) => {
  const { imageUrl, setImageUrl, loading, alert, success, invalid, handleAdd, resetNotifications } =
    useCoverAddition(selectedBookId);

  return (
    <Stack spacing={2} marginBottom={2}>
      <Card
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
            {imageUrl ? (
              <CardMedia
                component="img"
                src={imageUrl}
                alt="New cover preview"
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
                  Paste an image URL
                </Typography>
              </Box>
            )}
          </Box>
          <TextField
            label="Image URL"
            variant="outlined"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            error={!!invalid}
            helperText={invalid || ' '}
            sx={{ minWidth: 400 }}
          />
        </Stack>

        <CardActions>
          <Button variant="contained" color="primary" disabled={loading} onClick={handleAdd}>
            Add Cover
          </Button>
        </CardActions>
      </Card>

      {(success || alert) && (
        <ActionNotification
          success={success}
          callbacks={[resetNotifications]}
          successMessage="Cover added successfully!"
          alert={alert}
        />
      )}
    </Stack>
  );
};
