// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CssBaseline } from '@mui/material';
import { UserProvider } from './context/UserContext';
import { HomeDataProvider } from './context/HomeDataContext';
import { RecommendationProvider } from './context/RecommendationContext';

// main.jsx
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#141414',
      paper: '#1f1f1f',
    },
    text: {
      primary: '#fff',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <RecommendationProvider>
          <HomeDataProvider>
            <App />
          </HomeDataProvider>
        </RecommendationProvider>
      </UserProvider>
    </ThemeProvider>
  </React.StrictMode>
);
