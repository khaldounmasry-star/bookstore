'use client';

import { FC, useState } from 'react';
import { SearchFilterIcon } from './SearchFilterIcon';
import { SearchFilterDrawer } from './SearchFilterDrawer';

export const SearchFilter: FC<{ genres: string[] }> = ({ genres }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SearchFilterIcon onOpen={() => setOpen(true)} />
      <SearchFilterDrawer genres={genres} open={open} onClose={() => setOpen(false)} />
    </>
  );
};
