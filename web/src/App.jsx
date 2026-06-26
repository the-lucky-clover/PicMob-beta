import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import SignIn from './components/SignIn'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgot-password" element={<div style={{color: '#fff', padding: '2rem'}}>Forgot Password Page</div>} />
      </Routes>
    </Router>
  )
}
