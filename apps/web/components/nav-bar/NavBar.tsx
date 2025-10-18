'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { AppBar, Box, Toolbar, IconButton, MenuItem, Menu } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Image from 'next/image';
import Logo from '../../public/logo.svg';
import { SearchBar } from '../search-bar';
import { useAuth } from '../../contexts/AuthContext';

export const NavBar = () => {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();
  const [auth, setAuth] = React.useState(isAuthenticated);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  React.useEffect(() => {
    const token = Cookies.get('token');
    setAuth(Boolean(token));
  }, [pathname, isAuthenticated]);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ display: 'flex', mr: 2 }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center' }}>
              <Image
                src={Logo}
                alt="Logo"
                width={120}
                height={40}
                priority
                hidden={/admin/i.test(pathname)}
              />
            </Link>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <SearchBar />
          <Box sx={{ display: 'flex' }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        id="primary-search-account-menu"
        keepMounted
        open={isMenuOpen}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {!auth ? (
          <MenuItem onClick={handleMenuClose}>
            <Link href="/signin" style={{ textDecoration: 'none', color: 'primary.main' }}>
              Sign in
            </Link>
          </MenuItem>
        ) : (
          [
            <MenuItem onClick={handleMenuClose} key="admin-link">
              <Link href="/admin" style={{ textDecoration: 'none', color: 'primary.main' }}>
                Admin
              </Link>
            </MenuItem>,
            <MenuItem
              onClick={() => {
                logout();
                setAuth(false);
                handleMenuClose();
              }}
              key="sign-out-link"
            >
              Sign out
            </MenuItem>
          ]
        )}
      </Menu>
    </Box>
  );
};
