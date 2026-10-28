import React, { useState } from 'react';
import './Login.css';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../Services/api';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // 1. Added loading state tracker
    const [loading, setLoading] = useState(false); 

    const handleLogin = async () => {

        // 2. Set loading to true immediately when login starts
        setLoading(true); 
        setError(''); 
        try {
            const response = await authService.login(email, password);
            localStorage.setItem('token', response.data);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials or unverified email address.');
        } finally {
            // 3. Turn off loading when the request completes (success or fail)
            setLoading(false); 
        }
    };

    return (
    <div className="login-page" style={styles.page}>        {/* Left Panel */}
        <div className="login-left-panel" style={styles.leftPanel}>
            <div style={styles.leftContent}>
                <h1 style={styles.brandName}>ClassSync</h1>
                <p style={styles.brandTagline}>Never miss a deadline again.</p>
                <div style={styles.featureList}>
                    <div style={styles.featureItem}>
                        <span>Email reminders at 72, 24, and 4 hours before due dates</span>
                    </div>
                    <div style={styles.featureItem}>
                        <span>Automatic sync with your Canvas account every hour</span>
                    </div>
                    <div style={styles.featureItem}>
                        <span>Stop reminders the moment you submit</span>
                    </div>
                    <div style={styles.featureItem}>
                        <span>Works with any university using Canvas</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Panel */}
        <div className="login-right-panel" style={styles.rightPanel}>
            <div className="login-form-container" style={styles.formContainer}>
                <h2 style={styles.formTitle}>Welcome!</h2>
                <p style={styles.formSubtitle}>Sign in to your ClassSync account</p>

                <form style={styles.form} onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                    <div style={styles.field}>
                        <label style={styles.label}>Email</label>
                        <input
                            style={styles.input}
                            type="email"
                            name="username"
                            id="username"
                            autoComplete="username"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div style={styles.field}>
                        <div style={styles.passwordHeader}>
                            <label style={styles.label}>Password</label>
                            <Link to="/forgot-password" style={styles.forgotLink}>
                                Forgot password?
                            </Link>
                        </div>
                        <input
                            style={styles.input}
                            type="password"
                            name="password"
                            id="password"
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && <p style={styles.error}>{error}</p>}

                    <button style={{
                            ...styles.button,
                            backgroundColor: loading ? '#6678d1' : '#4361ee',
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }} 
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Connecting to Server...' : 'Login'}
                    </button>
                </form>

                <p style={styles.registerText}>
                    Don't have an account?{' '}
                    <Link to="/register" style={styles.link}>Create one!</Link>
                </p>

                
            </div>
        </div>
    </div>
);

   
}

const styles = {
    page: {
        display: 'flex',
        minHeight: '100vh',
        minHeight: '100dvh',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
    },

    // Left panel
    leftPanel: {
        flex: 1,
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #4361ee 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px',
    },
    leftContent: {
        maxWidth: '440px',
        color: 'white',
    },
    brandName: {
        fontSize: '42px',
        fontWeight: '800',
        margin: '0 0 12px 0',
        letterSpacing: '-1px',
    },
    brandTagline: {
        fontSize: '20px',
        color: 'rgba(255,255,255,0.75)',
        margin: '0 0 48px 0',
        lineHeight: '1.5',
    },
    featureList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    featureItem: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
        fontSize: '15px',
        color: 'rgba(255,255,255,0.85)',
        lineHeight: '1.5',
    },
    featureIcon: {
        fontSize: '20px',
        flexShrink: 0,
        marginTop: '1px',
    },

    // Right panel
    rightPanel: {
        flex: '0 0 480px',
        boxSizing: 'border-box',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 48px',
    },
    formContainer: {
        width: '100%',
        maxWidth: '360px',
    },
    formTitle: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#1a1a2e',
        margin: '0 0 8px 0',
    },
    formSubtitle: {
        fontSize: '14px',
        color: '#888',
        margin: '0 0 32px 0',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        marginBottom: '24px',
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    passwordHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: '13px',
        fontWeight: '500',
        color: '#444',
    },
    forgotLink: {
        fontSize: '12px',
        color: '#4361ee',
        textDecoration: 'none',
    },
    input: {
        padding: '11px 14px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.2s',
        width: '100%',
        boxSizing: 'border-box',
    },
    error: {
        color: '#e63946',
        fontSize: '13px',
        margin: 0,
        padding: '10px 14px',
        backgroundColor: '#fff0f0',
        borderRadius: '8px',
        border: '1px solid #ffd0d0',
    },
    button: {
        padding: '12px',
        backgroundColor: '#4361ee',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '4px',
    },
    registerText: {
        textAlign: 'center',
        fontSize: '13px',
        color: '#666',
        margin: '0 0 16px 0',
    },
    link: {
        color: '#4361ee',
        textDecoration: 'none',
        fontWeight: '500',
    },
};

export default Login;