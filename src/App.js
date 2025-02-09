import { ToastContainer } from 'react-toastify';
import Router from './router/Router.jsx';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/navbar';
import Footer from './components/footer/Footer.jsx';
import { useAuth } from './contexts/AuthContext.js';
import { useEffect } from 'react';

function App() {
  const { initializeUser } = useAuth();

  useEffect(() => {
    initializeUser();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Router />
        <ToastContainer />
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
