import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';

export const SideBarToggle = () => {
  const [open, setOpen] = useState(true);

  return (
    <Tooltip title={open ? 'Hide sidebar' : 'Show sidebar'}>
      <IconButton onClick={() => setOpen(!open)}>
        <MenuIcon />
      </IconButton>
    </Tooltip>
  );
};
