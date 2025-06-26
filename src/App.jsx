import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Capture from './pages/Capture';
import Gallery from './pages/Gallery.jsx';
import Navigation from './components/Navigation.jsx';

const App = () => {
  return (
    <Router>
      <div className="bg-black text-white min-h-screen font-sans">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/capture" element={<Capture />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
