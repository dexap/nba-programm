import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import ScheduleDifficulty from './pages/ScheduleDifficulty';
import './index.css';

function Navigation() {
  const location = useLocation();
  return (
    <nav className="main-nav">
      <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Standings</Link>
      <Link to="/difficulty" className={`nav-link ${location.pathname === '/difficulty' ? 'active' : ''}`}>Schedule Difficulty</Link>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/difficulty" element={<ScheduleDifficulty />} />
        </Routes>
        <footer className="app-footer">
          <p>Data provided by NBA.com & ESPN (Unofficial). Built for NBA fans.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
