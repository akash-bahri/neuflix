import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import {
  Container,
  TextField,
  Button,
  Paper,
  Typography,
  Box,
} from '@mui/material';

import logoTop from '../assets/logo7.png';  // NEUFLIX text logo (transparent)
import logoMain from '../assets/logo5.png'; // Red N with LVX VERITAS VIRTUS

const Login = () => {
  const [input, setInput] = useState('');
  const navigate = useNavigate();
  const { setUserId } = useUser();

  const handleLogin = () => {
    if (input.trim()) {
      setUserId(parseInt(input));
      navigate('/home');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10, textAlign: 'center' }}>
      
      {/* Top NEUFLIX Logo */}
      <Box
        component="img"
        src={logoTop}
        alt="NEUFLIX Text Logo"
        sx={{ height: 100, mb: 3, mx: 'auto' }}
      />

      {/* Login Box */}
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
        
        {/* Center N logo */}
        <Box
          component="img"
          src={logoMain}
          alt="NEUFLIX Logo"
          sx={{ height: 100, mb: 2, mx: 'auto' }}
        />

        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Enter your User ID to continue
        </Typography>

        <TextField
          fullWidth
          type="number"
          label="User ID"
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleLogin}
          sx={{
            backgroundColor: '#D81F26',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#b71c1c',
            },
          }}
        >
          Login
        </Button>
      </Paper>
    </Container>
  );
};

export default Login;
