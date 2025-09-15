import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DashboardPage, PropertyPage } from './pages';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/property/:propertyId" element={<PropertyPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
