// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Components/Layout';
import Main from './Components/Main';
import Scan from './Components/Scan/Scan';
import Predict from './Components/Predict'; // New component
import LoginSignup from './Components/Login/LoginSignup';
import ProtectedRoute from './Components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Main />} />
          <Route
            path="scan"
            element={
              <ProtectedRoute>
                <Scan />
              </ProtectedRoute>
            }
          />
          <Route
            path="predictions"
            element={
              <ProtectedRoute>
                <Predict />
              </ProtectedRoute>
            }
          />
          <Route path="login" element={<LoginSignup />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
