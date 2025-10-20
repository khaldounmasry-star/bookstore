import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '../../lib';
import { SideBar } from '../../components/admin/side-bar';
import Box from '@mui/material/Box';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    redirect('/signin');
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50', overflowX: 'hidden' }}>
      <SideBar role={user.role} />
      <Box component="main" sx={{ flexGrow: 1, p: 4, minWidth: 0 }}>
        {children}
      </Box>
    </Box>
  );
}
