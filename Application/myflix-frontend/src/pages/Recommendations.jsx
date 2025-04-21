import {
  Container,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  CircularProgress,
  Box,
} from '@mui/material';
import { useState, useEffect } from 'react';
import MovieModal from '../components/MovieModal';
import { useRecommendation } from '../context/RecommendationContext';

const Recommendations = () => {
  const [model, setModel] = useState('cf');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { recommendations, fetchRecommendations, loading } = useRecommendation();

  useEffect(() => {
    fetchRecommendations(model);
  }, [model]);

  const currentMovies = recommendations[model] || [];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#fff' }}>
        Recommendations
      </Typography>

      <ToggleButtonGroup
        value={model}
        exclusive
        onChange={(_, val) => val && setModel(val)}
        sx={{ mb: 4 }}
      >
        <ToggleButton value="cf">Collaborative Filtering</ToggleButton>
        <ToggleButton value="cluster">Cluster-Based</ToggleButton>
      </ToggleButtonGroup>

      {loading && !currentMovies.length ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {currentMovies.map((movie) => (
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
                  onClick={() => {
                    setSelectedMovie(movie);
                    setModalOpen(true);
                  }}
                />
              ) : (
                <Typography>No poster available</Typography>
              )}
            </Grid>
          ))}
        </Grid>
      )}

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

export default Recommendations;
