import React from 'react';

import Register from './pages/Register';
import Login from './pages/Login';
import MainDashboard from './pages/MainDashboard';

import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter> {/* BrowserRouter reads URL in browser*/}
      {/* Routes render the correct page component for each path */}
      <Routes>
        {/* when no subpath in url, redirects to login route */}
        <Route path = "/" element = {<Navigate to = "/login" replace/>}/>
        <Route path = "/register" element = {<Register/>}/>
        <Route path = "/login" element = {<Login/>}/>
        <Route path = "/dashboard" element = {<MainDashboard/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App