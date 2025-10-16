'use client';

import { IconButton, Tooltip } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';

interface SearchFilterIconProps {
  onOpen: () => void;
}

export const SearchFilterIcon = ({ onOpen }: SearchFilterIconProps) => (
  <Tooltip title="Filter books">
    <IconButton
      color="primary"
      onClick={onOpen}
      aria-label="Open filters"
      sx={{
        position: 'fixed',
        bottom: 25,
        right: 25,
        zIndex: 1200,
        bgcolor: 'background.paper',
        boxShadow: 2,
        '&:hover': { bgcolor: 'grey.100' }
      }}
    >
      <TuneIcon />
    </IconButton>
  </Tooltip>
);
