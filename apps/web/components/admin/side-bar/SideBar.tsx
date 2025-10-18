'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { SideBarToggle } from './SideBarToggle';
import Box from '@mui/material/Box';

interface Props {
  role: 'ADMIN' | 'SUPER_ADMIN';
}

const drawerWidth = 240;

export const SideBar = ({ role }: Props) => {
  const pathname = usePathname();

  const links = [
    { label: 'Books', path: '/admin/books' },
    { label: 'Covers', path: '/admin/books/covers' },
    ...(role === 'SUPER_ADMIN' ? [{ label: 'Users', path: '/admin/users' }] : [])
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: 'background.paper'
        }
      }}
    >
      <Toolbar>
        <Typography variant="h6" fontWeight={700}>
          Admin Panel
        </Typography>
      </Toolbar>
      <Box sx={{ px: 2 }}>
        <SideBarToggle />
      </Box>
      <List>
        {links.map(link => (
          <ListItem key={link.path} disablePadding>
            <ListItemButton
              component={Link}
              href={link.path}
              selected={pathname.startsWith(link.path)}
            >
              <ListItemText primary={link.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
