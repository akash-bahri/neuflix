// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from './context/UserContext';
import Login from './pages/Login';
import Home from './pages/Home';
import Recommendations from './pages/Recommendations';
import MyList from './pages/MyList';
import Navbar from './components/Navbar';

const App = () => {
  const { userId } = useUser();

  return (
    <Router>
      {userId && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        {userId ? (
          <>
            <Route path="/home" element={<Home />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/mylist" element={<MyList />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;
