import React from 'react';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import Courses from './Pages/Courses';
import Settings from './Pages/Settings';
import Verify from './Pages/Verify';


import ResetPassword  from './Pages/ResetPassword.js';
import { ForgotPassword } from './Pages/ForgotPassword.js';



function App() {
    console.log("ResetPassword type:", typeof ResetPassword, ResetPassword);
    console.log("ForgotPassword type:", typeof ForgotPassword, ForgotPassword);
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/courses" element={<Courses />}/>
                <Route path="/settings" element={<Settings />} />
                <Route path="/verify" element={<Verify />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="*" element={<Navigate to="/login" />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;