import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../Services/api';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [canvasBaseUrl, setCanvasBaseUrl] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (!name || !email || !password || !canvasBaseUrl) {
            setError('All fields are required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await authService.register(name, email, password, canvasBaseUrl);
            setSuccess('Account created successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError('Email already registered or something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>ClassSync</h1>
                <p style={styles.subtitle}>Create your account</p>

                <input
                    style={styles.input}
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

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

                <input
                    style={styles.input}
                    type="text"
                    placeholder="Canvas URL (e.g. montclair.instructure.com)"
                    value={canvasBaseUrl}
                    onChange={(e) => setCanvasBaseUrl(e.target.value)}
                />

                {error && <p style={styles.error}>{error}</p>}
                {success && <p style={styles.success}>{success}</p>}

                <button
                    style={{...styles.button, opacity: loading ? 0.7 : 1}}
                    onClick={handleRegister}
                    disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                </button>

                <p style={styles.loginText}>
                    Already have an account?{' '}
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
    error: {
        color: 'red',
        fontSize: '13px',
        margin: 0,
    },
    success: {
        color: 'green',
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
    loginText: {
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

export default Register;