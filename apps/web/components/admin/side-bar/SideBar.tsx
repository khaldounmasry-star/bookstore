'use client';

import Link from 'next/link';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { SideBarToggle } from './SideBarToggle';
import { useState } from 'react';
import { SideBarProps } from '../../../types';
import Box from '@mui/material/Box';

const drawerWidth = 340;
const collapsedWidth = 72;

export const SideBar = ({ role }: SideBarProps) => {
  const [open, setOpen] = useState(true);

  const links = [
    { label: 'Books', path: '/admin/books' },
    { label: 'Covers', path: '/admin/books/covers' },
    ...(role === 'SUPER_ADMIN' ? [{ label: 'Users', path: '/admin/users' }] : [])
  ];

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        overflowX: 'hidden',
        transition: theme =>
          theme.transitions.create('width', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.leavingScreen
          }),
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : collapsedWidth,
          overflowX: 'hidden',
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          transition: theme =>
            theme.transitions.create('width', {
              easing: theme.transitions.easing.easeIn,
              duration: theme.transitions.duration.enteringScreen
            })
        }
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          px: 2,
          transition: theme =>
            theme.transitions.create('all', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.shortest
            })
        }}
      >
        {open && (
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              opacity: open ? 1 : 0,
              transition: theme =>
                theme.transitions.create('opacity', {
                  duration: theme.transitions.duration.shortest
                })
            }}
          >
            Admin Panel
          </Typography>
        )}
        <SideBarToggle open={open} setOpen={setOpen} />
      </Toolbar>

      <List>
        {links.map(link => (
          <ListItem key={link.path} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              component={Link}
              href={link.path}
              sx={{
                minHeight: 48,
                justifyContent: 'initial',
                px: 2.5,
                transition: theme =>
                  theme.transitions.create('padding', {
                    duration: theme.transitions.duration.shortest
                  })
              }}
            >
              <Box
                sx={{
                  opacity: open ? 1 : 0,
                  transition: theme =>
                    theme.transitions.create('opacity', {
                      duration: theme.transitions.duration.shortest
                    })
                }}
              >
                <ListItemText primary={link.label} />
              </Box>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};
