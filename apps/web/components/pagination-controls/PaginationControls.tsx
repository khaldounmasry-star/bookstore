'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { PaginationControlsProps } from '../../types';

export const PaginationControls = ({ limit, offset, total }: PaginationControlsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get('q') ?? '';
  const nextOffset = offset + limit;
  const prevOffset = Math.max(0, offset - limit);

  const goTo = (newOffset: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('limit', String(limit));
    params.set('offset', String(newOffset));
    if (q) params.set('q', q);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        mt: 3
      }}
    >
      <Tooltip title="Previous page">
        <span>
          <IconButton
            aria-label="Previous page"
            disabled={offset <= 0}
            onClick={() => goTo(prevOffset)}
            color="primary"
          >
            <ArrowBack />
          </IconButton>
        </span>
      </Tooltip>

      <Typography variant="h1" color="text.secondary" sx={{ minWidth: 80, textAlign: 'center' }}>
        Page {Math.floor(offset / limit) + 1}
      </Typography>

      <Tooltip title="Next page">
        <span>
          <IconButton
            aria-label="Next page"
            disabled={total < limit}
            onClick={() => goTo(nextOffset)}
            color="primary"
          >
            <ArrowForward />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
};
