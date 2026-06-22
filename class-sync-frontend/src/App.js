import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import Courses from './Pages/Courses';
import Settings from './Pages/Settings';


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/courses" element={<Courses />}/>
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/login" />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;