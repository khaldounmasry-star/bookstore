import { ImageBox } from './ImageBox';
import { BlurBox } from './BlurBox';
import { GradientBox } from './GradientBox';
import { ContentBox } from './ContentBox';
import { Book } from '../../types';
import { Card, CardActionArea } from '@mui/material';

export const BookCard = ({ book }: { book: Book }) => (
  <Card
    sx={{
      position: 'relative',
      borderRadius: 4,
      overflow: 'hidden',
      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
      height: 380,
    }}
  >
    <CardActionArea sx={{ height: '100%', position: 'relative' }}>
      <ImageBox {...book} />
      <BlurBox />
      <GradientBox />
      <ContentBox {...book} />
    </CardActionArea>
  </Card>
);
