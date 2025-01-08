import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import About from './pages/About';
import Auth from './pages/Auth';
import Tokens from './pages/Tokens';
import { Toaster } from './components/ui/toaster';

const App = () => {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/tokens" element={<Tokens />} />
        <Route path="/about" element={<About />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
      <Toaster />
    </Router>
  );
};

export default App;