// src/context/HomeDataContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const HomeDataContext = createContext();
export const useHomeData = () => useContext(HomeDataContext);

const GENRES = ['Action', 'Comedy', 'Drama', 'Thriller', 'Animation'];

export const HomeDataProvider = ({ children }) => {
  const [spotlight, setSpotlight] = useState([]);
  const [genres, setGenres] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const spotlightRes = await axios.get('http://localhost:5000/api/movies/latest');
        setSpotlight(spotlightRes.data);

        const genreResults = {};
        for (let genre of GENRES) {
          const genreRes = await axios.get(`http://localhost:5000/api/movies/genre/${genre}`);
          genreResults[genre] = genreRes.data;
        }

        setGenres(genreResults);
      } catch (error) {
        console.error('Error loading home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <HomeDataContext.Provider value={{ spotlight, genres, loading }}>
      {children}
    </HomeDataContext.Provider>
  );
};
