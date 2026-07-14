import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../Services/api';

export function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [sent, setSent] = useState(false);

    const handleSubmit = async () => {
        try {
            await authService.forgotPassword(email);
            setSent(true);
            setMessage('If that email exists you will receive a reset link. Check your inbox and spam folder.');
        } catch (err) {
            setMessage('Something went wrong. Please try again.');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>ClassSync</h1>
                <p style={styles.subtitle}>Enter your email to reset your password</p>

                {!sent && (
                    <input
                        style={styles.input}
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                )}

                {message && (
                    <p style={{ color: 'green', fontSize: '13px' }}>{message}</p>
                )}

                {!sent && (
                    <button style={styles.button} onClick={handleSubmit}>
                        Send Reset Link
                    </button>
                )}

                <p style={styles.registerText}>
                    Remember your password?{' '}
                    <Link to="/login" style={styles.link}>Login here</Link>
                </p>
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
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    title: {
        margin: 0,
        fontSize: '28px',
        color: '#1a1a2e',
        textAlign: 'center',
    },
    subtitle: {
        margin: 0,
        color: '#666',
        textAlign: 'center',
        fontSize: '14px',
    },
    input: {
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '14px',
        outline: 'none',
    },
    button: {
        padding: '12px',
        backgroundColor: '#4361ee',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        cursor: 'pointer',
    },
    registerText: {
        textAlign: 'center',
        fontSize: '13px',
        color: '#666',
        margin: 0,
    },
    link: {
        color: '#4361ee',
        textDecoration: 'none',
    },
};

