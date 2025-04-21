// src/pages/Home.jsx
import { Container, CircularProgress } from '@mui/material';
import { useHomeData } from '../context/HomeDataContext';
import Spotlight from '../components/Spotlight';
import GenreRow from '../components/GenreRow';
import MovieModal from '../components/MovieModal';
import { useState } from 'react';

const Home = () => {
  const { spotlight, genres, loading } = useHomeData();

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = (movie) => {
    setSelectedMovie(movie);
    setModalOpen(true);
  };

  if (loading) return <Container><CircularProgress sx={{ mt: 3.2 }} /></Container>; // Reduced from mt: 4 to mt: 3.2

  return (
    <Container maxWidth="xl" sx={{ py: 3.2 }}> {/* Reduced from py: 4 to py: 3.2 */}
      <Spotlight movies={spotlight} onMovieClick={openModal} />
      {Object.entries(genres).map(([genre, movies]) => (
        <GenreRow key={genre} genre={genre} movies={movies} onMovieClick={openModal} />
      ))}
      <MovieModal open={modalOpen} handleClose={() => setModalOpen(false)} movie={selectedMovie} />
    </Container>
  );
};

export default Home;
