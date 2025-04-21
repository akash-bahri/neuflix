// src/components/Navbar.jsx
import { AppBar, Toolbar, Tabs, Tab, Button, Box, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useRecommendation } from '../context/RecommendationContext';
import logo from '../assets/logo5.png'; // adjust path as needed

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserId } = useUser();
  const { resetRecommendations } = useRecommendation();

  const handleChange = (_, newValue) => {
    navigate(newValue);
  };

  const handleLogout = () => {
    resetRecommendations();
    setUserId(null);
    navigate('/');
  };

  const currentTab = () => {
    if (location.pathname.startsWith('/home')) return '/home';
    if (location.pathname.startsWith('/recommendations')) return '/recommendations';
    if (location.pathname.startsWith('/mylist')) return '/mylist';
    return false;
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#141414', px: 1.6 }}> 
      <Toolbar variant="dense"> 
        {/* Logo + Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 3.2, cursor: 'pointer' }} onClick={() => navigate('/home')}> {/* Reduced margin */}
          <Box
            component="img"
            src={logo}
            alt="NEUFLIX Logo"
            sx={{ height: 80, mr: 0.8, padding: 0.8 }} 
          />
          <Typography variant="h5" sx={{ color: '#fff', fontWeight: 'bold', letterSpacing: 0.8 }}> {/* Changed from h4 to h5 */}
            NEUFLIX
          </Typography>
        </Box>

        {/* Tabs */}
        <Tabs
          value={currentTab()}
          onChange={handleChange}
          textColor="inherit"
          indicatorColor="secondary"
          sx={{ 
            '.MuiTab-root': { 
              color: '#fff', 
              fontWeight: 'bold',
              fontSize: '0.82rem', // Smaller font size for tabs
              minWidth: 120, // Reduced minimum width
              padding: '8px 12px' // Reduced padding
            } 
          }}
        >
          <Tab label="HOME" value="/home" />
          <Tab label="RECOMMENDATIONS" value="/recommendations" />
          <Tab label="MY LIST" value="/mylist" />
        </Tabs>

        <Box sx={{ flexGrow: 1 }} />

        {/* Logout Button */}
        <Button
          color="inherit"
          size="small" // Made button smaller
          onClick={handleLogout}
          sx={{
            fontWeight: 'bold',
            fontSize: '0.82rem', // Smaller font size
            padding: '6px 12px', // Reduced padding
            transition: 'all 0.3s ease',
            '&:hover': {
              color: 'white',
              backgroundColor: 'red',
            },
          }}
        >
          LOGOUT
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
