// src/context/RecommendationContext.jsx
import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';

const RecommendationContext = createContext();
export const useRecommendation = () => useContext(RecommendationContext);

export const RecommendationProvider = ({ children }) => {
  const { userId } = useUser();
  const [recommendations, setRecommendations] = useState({
    cf: null,
    cluster: null,
  });
  const [loading, setLoading] = useState(false);

  const fetchRecommendations = async (model) => {
    if (!userId || recommendations[model]) return;

    setLoading(true);
    const route =
      model === 'cf'
        ? `/api/recommendations/${userId}`
        : `/api/cluster_recommendations/${userId}`;

    try {
      const res = await axios.get(`http://localhost:5000${route}`);
      const withPosters = await Promise.all(
        res.data.map(async (movie) => {
          try {
            const posterRes = await axios.get(
              `http://localhost:5000/api/movie/${movie.movie_id}/poster`
            );
            return { ...movie, poster_url: posterRes.data.poster_url };
          } catch {
            return { ...movie, poster_url: null };
          }
        })
      );

      setRecommendations((prev) => ({
        ...prev,
        [model]: withPosters,
      }));
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetRecommendations = () => {
    setRecommendations({ cf: null, cluster: null });
  };

  return (
    <RecommendationContext.Provider
      value={{ recommendations, fetchRecommendations, resetRecommendations, loading }}
    >
      {children}
    </RecommendationContext.Provider>
  );
};
