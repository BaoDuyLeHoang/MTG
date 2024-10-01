import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Change Switch to Routes
import Dashboard from './admin/dashBoard/dashboard'; // Import your components


function App() {
  return (
    <Router> 
      <Routes> {/* Use Routes instead of Switch */}
        <Route path="/" element={<Dashboard />} /> {/* Use element prop */}
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;