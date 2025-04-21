// src/pages/MyList.jsx
import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  Box,
  Button,
} from '@mui/material';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import MovieModal from '../components/MovieModal';

const MyList = () => {
  const { userId } = useUser();
  const [ratedMovies, setRatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const openModal = (movie) => {
    setSelectedMovie(movie);
    setModalOpen(true);
  };

  useEffect(() => {
    const fetchRated = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/user_ratings/${userId}?page=${page}&per_page=10`
        );
        setRatedMovies(res.data.results);
        setTotalPages(res.data.total_pages);
      } catch (err) {
        console.error('Error fetching rated movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRated();
  }, [userId, page]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#fff' }}>
        My List
      </Typography>

      <Grid container spacing={3}>
        {ratedMovies.map((movie) => (
          <Grid item xs={6} sm={4} md={3} key={movie.movie_id}>
            {movie.poster_url ? (
              <Box
              component="img"
              src={movie.poster_url}
              alt={movie.title || 'Movie Poster'}
              sx={{
                width: '100%',
                height: 300,
                
                objectFit: 'cover',
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 20px rgba(255,255,255,0.15)',
                },
              }}
              onClick={() => openModal(movie)}
            />
            
            ) : (
              <Typography>No poster available</Typography>
            )}
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          mt: 5,
        }}
      >
        <Button
          variant="contained"
          color="secondary"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          sx={{ textTransform: 'none', px: 3 }}
        >
          Previous
        </Button>
        <Typography variant="body1" sx={{ color: '#fff', pt: 1 }}>
          Page {page} of {totalPages}
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          sx={{ textTransform: 'none', px: 3 }}
        >
          Next
        </Button>
      </Box>

      {selectedMovie && (
        <MovieModal
          open={modalOpen}
          handleClose={() => setModalOpen(false)}
          movie={selectedMovie}
        />
      )}
    </Container>
  );
};

export default MyList;
