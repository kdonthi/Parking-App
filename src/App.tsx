import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Shop from './pages/Shop';
import About from './pages/About';
import Auth from './pages/Auth';
import { Toaster } from './components/ui/toaster';

const App = () => {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
      <Toaster />
    </Router>
  );
};

export default App;