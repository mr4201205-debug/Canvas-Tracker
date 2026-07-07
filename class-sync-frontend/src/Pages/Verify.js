import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Verify() {
    const [message, setMessage] = useState('Verifying your email...');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (!token) {
            setMessage('Invalid verification link.');
            return;
        }

        axios.get(`https://classsync-backend.onrender.com/auth/verify?token=${token}`)
            .then(() => {
                setSuccess(true);
                setMessage('Email verified successfully. Redirecting to login...');
                setTimeout(() => navigate('/login'), 3000);
            })
            .catch(() => {
                setMessage('Invalid or expired verification link.');
            });
    }, [navigate]);

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>ClassSync</h1>
                <p style={{ color: success ? 'green' : '#333', fontSize: '16px' }}>{message}</p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5',
    },
    card: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        width: '380px',
        textAlign: 'center',
    },
    title: {
        margin: '0 0 20px 0',
        fontSize: '28px',
        color: '#1a1a2e',
    },
};

export default Verify;