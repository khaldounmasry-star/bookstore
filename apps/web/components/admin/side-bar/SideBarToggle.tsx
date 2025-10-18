'use client';

import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/Menu';
import { FC } from 'react';
import { SideBarToggleProps } from '../../../types';

export const SideBarToggle: FC<SideBarToggleProps> = ({ open, setOpen }) => (
  <Tooltip title={open ? 'Hide sidebar' : 'Show sidebar'}>
    <IconButton color="inherit" onClick={() => setOpen(!open)} size="small">
      <MenuIcon />
    </IconButton>
  </Tooltip>
);
