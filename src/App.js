import { ToastContainer } from 'react-toastify';
import Router from './router/Router.jsx';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/navbar';
import Footer from './components/footer/Footer.jsx';

function App() {
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
