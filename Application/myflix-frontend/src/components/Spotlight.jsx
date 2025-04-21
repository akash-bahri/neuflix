import { useEffect, useState } from 'react';
import { Box, Typography, Container, Fade } from '@mui/material';

const Spotlight = ({ movies }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % movies.length);
    }, 5000); // rotate every 5 seconds

    return () => clearInterval(interval);
  }, [movies.length]);

  const movie = movies[index];

  if (!movie) return null;

  return (
    <Container maxWidth="lg" sx={{ mt: 1.6 }}>
      <Fade in timeout={1000}>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: 480, // Reduced from 600px to 480px (80%)
            borderRadius: 4.8, // Reduced from 6 to 4.8
            overflow: 'hidden',
            backgroundColor: '#000',
          }}
        >
          <Box
            component="img"
            src={movie.backdrop_url || movie.poster_url}
            alt={movie.title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />

          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              p: 2.4, // Reduced from 3 to 2.4
              background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
              width: '100%',
            }}
          >
            <Typography variant="h5" sx={{ color: '#fff', fontWeight: 'bold', mb: 0.8 }}> {/* Changed from h4 to h5, mb reduced */}
              {movie.title}
            </Typography>
            <Typography variant="body2" sx={{ color: '#ccc' }}> {/* Changed from body1 to body2 */}
              {movie.genres?.join(', ') || 'No genres available'}
            </Typography>
          </Box>
        </Box>
      </Fade>
    </Container>
  );
};

export default Spotlight;
