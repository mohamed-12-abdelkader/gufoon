import { ToastContainer } from 'react-toastify';
import Router from './router/Router.jsx';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/navbar';
import Footer from './components/footer/Footer.jsx';
import { ChatProvider } from './contexts/ChatContext';
import FloatingChatButton from './components/chat/FloatingChatButton';
import './styles/global.css';
import './styles/floating-chat.css';

function App() {
  return (
    <>
      <BrowserRouter>
        <ChatProvider>
          <Navbar />
          <Router />
          <ToastContainer />
          <Footer />
          <FloatingChatButton />
        </ChatProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
