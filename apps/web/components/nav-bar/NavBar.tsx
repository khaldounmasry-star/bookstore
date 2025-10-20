'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { AppBar, Box, Toolbar, IconButton, MenuItem, Menu } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Image from 'next/image';
import Logo from '../../public/logo.svg';
import { SearchBar } from '../search-bar';
import { useAuth } from '../../contexts/AuthContext';
import { Role } from '../../types';

export const NavBar = () => {
  const pathname = usePathname();
  const { role, isAuthenticated, logout } = useAuth();
  const [auth, setAuth] = useState(isAuthenticated);
  const [userRole, setUserRole] = useState(role);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const token = Cookies.get('token');
    const role = Cookies.get('role');
    setAuth(Boolean(token));
    setUserRole(role);
  }, [pathname, isAuthenticated, role]);

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
            <Link href="/signin" style={{ textDecoration: 'none', color: 'inherit' }}>
              Sign in
            </Link>
          </MenuItem>
        ) : (
          [
            userRole && userRole !== Role.USER && (
              <MenuItem onClick={handleMenuClose} key="admin-link">
                <Link href="/admin" style={{ textDecoration: 'none', color: 'inherit' }}>
                  Admin
                </Link>
              </MenuItem>
            ),
            <MenuItem
              onClick={() => {
                logout();
                setAuth(false);
                setUserRole(null);
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
