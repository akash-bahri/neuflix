// src/components/MovieModal.jsx
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Typography,
    Rating,
    IconButton
  } from '@mui/material';
  import CloseIcon from '@mui/icons-material/Close';
  import { useState } from 'react';
  import axios from 'axios';
  import { useUser } from '../context/UserContext';
  import { useEffect } from 'react';


  
  
  const MovieModal = ({ open, handleClose, movie }) => {
    const { userId } = useUser();
    const [userRating, setUserRating] = useState(null);

    useEffect(() => {
      setUserRating(movie?.rating || null);
    }, [movie]);
    
    const handleRating = async (value) => {
      setUserRating(value);
      try {
        await axios.post('http://localhost:5000/api/rate', {
          user_id: userId,
          movie_id: movie.movie_id,
          rating: value,
        });
      } catch (err) {
        console.error('Error saving rating:', err);
      }
    };
  
    if (!movie) return null;
  
   
    const imdbUrl = movie.imdb_id ? `https://www.imdb.com/title/tt${movie.imdb_id}` : null;
  
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <Box sx={{ position: 'absolute', right: 6, top: 6 }}>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <DialogTitle sx={{ fontSize: '1.2rem', py: 1.6 }}>{movie.title}</DialogTitle>
        <DialogContent sx={{ py: 1.6 }}>
          <Box sx={{ textAlign: 'center' }}>
            {imdbUrl ? (
              <a href={imdbUrl} target="_blank" rel="noreferrer">
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  style={{ width: '50%', borderRadius: 6 }}
                />
              </a>
            ) : (
              <img
                src={movie.poster_url}
                alt={movie.title}
                style={{ width: '50%', borderRadius: 6 }}
              />
            )}
            {movie.genres && movie.genres.length > 0 && (
              <Typography variant="subtitle2" sx={{ mt: 1.6 }}>
                Genres: {movie.genres.join(', ')}
              </Typography>
            )}
           
              <Box sx={{ mt: 1.6 }}>
                <Typography variant="body2">Rate this movie:</Typography>
                <Rating
                  value={userRating}
                  onChange={(_, newValue) => handleRating(newValue)}
                  precision={1}
                  size="medium"
                />
              </Box>
           
          </Box>
        </DialogContent>
      </Dialog>
    );
  };
  
  export default MovieModal;
