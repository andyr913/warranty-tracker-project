import React from 'react';

import Register from './pages/Register';
import Login from './pages/Login';
import MainDashboard from './pages/MainDashboard';

import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {useAuth} from './AuthContext';

function App() {
  // gets current user details
  const {user} = useAuth();

  return (
    <BrowserRouter> {/* BrowserRouter reads URL in browser*/}
      {/* Routes render the correct page component for each path */}
      <Routes>
        {/* when no subpath in url, redirects to login route */}
        <Route path = "/" element = {<Navigate to = "/login" replace/>}/>
        <Route path = "/register" element = {<Register/>}/>
        <Route path = "/login" element = {<Login/>}/>
        {/* if user's session is saved in browser, dashboard renders otherwise redirects to login */}
        <Route 
          path = "/dashboard" 
          element = {user ? <MainDashboard/> : <Navigate to = "/login" replace/>}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App;