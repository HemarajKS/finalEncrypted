import './style.css';
import { useEffect } from 'react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import Router from './components/routes/router';

function App() {
  const navigate = useNavigate();

  const landingLocation = () => {
    if (window.location.pathname === '/landing') {
      navigate('/');
      window.location.reload();
    }
  };

  useEffect(() => {
    landingLocation();
  }, []);

  return (
    <div className="App">
      <>
        <Router />
      </>
    </div>
  );
}

export default App;
