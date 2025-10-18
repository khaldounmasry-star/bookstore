'use client';

import * as React from 'react';
import Link from 'next/link';
import { AppBar, Box, Toolbar, IconButton, MenuItem, Menu } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Logo from '../../public/logo.svg';
import Image from 'next/image';
import { SearchBar } from '../search-bar';

export const NavBar = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      id={menuId}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        <Link href="/signin" style={{ textDecoration: 'none', color: 'primary.main' }}>
          Sign in
        </Link>
      </MenuItem>
      {/* <MenuItem onClick={handleMenuClose}>My account</MenuItem> */}
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ display: 'flex', mr: 2 }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center' }}>
              <Image src={Logo} alt="Logo" width={120} height={40} priority />
            </Link>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <SearchBar />
          <Box sx={{ display: 'flex' }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </Box>
  );
};
