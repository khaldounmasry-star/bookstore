import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function AdminBookCoversPage() {
  return (
    <Box>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Manage Book Covers
      </Typography>
      <Typography color="text.secondary">
        Upload, update, or delete book cover images here.
      </Typography>
    </Box>
  );
}
