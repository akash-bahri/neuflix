import { Box, Typography, Card, CardMedia, CardActionArea, IconButton } from '@mui/material';
import { useRef, useState, useEffect } from 'react';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

const GenreRow = ({ genre, movies, onMovieClick }) => {
  const scrollRef = useRef(null);
  const [showArrows, setShowArrows] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (el) {
      setAtStart(el.scrollLeft === 0);
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1); // -1 to avoid rounding issues
    }
  };

  const scroll = (direction) => {
    const el = scrollRef.current;
    const scrollAmount = 240; // Reduced from 300 to 240
    if (el) {
      el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  // Add scroll listener
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    handleScroll(); // Initialize position
    el.addEventListener('scroll', handleScroll);

    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box
      sx={{ position: 'relative', mb: 4.8, px: 4.8 }} // Reduced from mb: 6, px: 6 to mb: 4.8, px: 4.8
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      <Typography variant="subtitle1" gutterBottom> {/* Changed from h6 to subtitle1 */}
        {genre}
      </Typography>

      {/* Left Arrow */}
      {showArrows && (
        <IconButton
          size="small" // Added size="small"
          onClick={() => scroll('left')}
          sx={{
            position: 'absolute',
            top: '50%',
            left: 0,
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            bgcolor: atStart ? 'red' : 'rgba(0,0,0,0.4)',
            color: 'white',
            '&:hover': { bgcolor: atStart ? 'darkred' : 'rgba(0,0,0,0.6)' },
          }}
        >
          <ArrowBackIos fontSize="small" />
        </IconButton>
      )}

      {/* Scrollable Row */}
      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          overflowX: 'auto',
          gap: 2.4, // Reduced from 3 to 2.4
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
          scrollSnapType: 'x mandatory',
          '&::-webkit-scrollbar': { display: 'none' },
          '& > *': {
            scrollSnapAlign: 'start',
          },
        }}
      >
        {movies.map((movie) => (
          <Card
            key={movie.movie_id}
            sx={{
              minWidth: 160, // Reduced from 200 to 160
              borderRadius: 1.6, // Reduced from 2 to 1.6
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0px 3px 16px rgba(255,255,255,0.2)', // Reduced shadow size
              },
            }}
          >
            <CardActionArea onClick={() => onMovieClick(movie)}>
              <CardMedia
                component="img"
                height="256" // Reduced from 320 to 256
                image={movie.poster_url}
                alt={movie.title}
              />
            </CardActionArea>
          </Card>
        ))}
      </Box>

      {/* Right Arrow */}
      {showArrows && (
        <IconButton
          size="small" // Added size="small"
          onClick={() => scroll('right')}
          sx={{
            position: 'absolute',
            top: '50%',
            right: 0,
            transform: 'translate(50%, -50%)',
            zIndex: 10,
            bgcolor: atEnd ? 'red' : 'rgba(0,0,0,0.4)',
            color: 'white',
            '&:hover': { bgcolor: atEnd ? 'darkred' : 'rgba(0,0,0,0.6)' },
          }}
        >
          <ArrowForwardIos fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};

export default GenreRow;
