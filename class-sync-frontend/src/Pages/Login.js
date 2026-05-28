import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../Services/api';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await authService.login(email, password);
            localStorage.setItem('token', response.data);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>ClassSync</h1>
                <p style={styles.subtitle}>Never Miss a Deadline</p>

                <input
                    style={styles.input}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    style={styles.input}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && <p style={styles.error}>{error}</p>}

                <button style={styles.button} onClick={handleLogin}>
                    Login
                </button>

                <p style={styles.registerText}>
                    Don't have an account?{' '}
                    <Link to="/register" style={styles.link}>Register here</Link>
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
    error: {
        color: 'red',
        fontSize: '13px',
        margin: 0,
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

export default Login;