import React, { useState } from 'react';
import './Register.css';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../Services/api';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [canvasBaseUrl, setCanvasBaseUrl] = useState('');
    const [canvasToken, setCanvasToken] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (!name || !email || !password || !canvasBaseUrl || !canvasToken) {
            setError('All fields are required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await authService.register(name, email, password, canvasBaseUrl, canvasToken);
            setSuccess('Account created successfully! Check inbox or spam folder for verification link.');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError('Email already registered or something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
    <div className="register-page" style={styles.page}>
        {/* Left Panel */}
        <div className="register-left-panel" style={styles.leftPanel}>
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
        <div className="register-right-panel" style={styles.rightPanel}>
            <div className="register-form-container" style={styles.formContainer}>
                <h2 style={styles.formTitle}>Create your account</h2>
                <p style={styles.formSubtitle}>
                    Get started with ClassSync
                </p>

                <form
                    style={styles.form}
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleRegister();
                    }}
                >
                    <div style={styles.field}>
                        <label style={styles.label}>Full Name</label>
                        <input
                            style={styles.input}
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Email</label>
                        <input
                            style={styles.input}
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Password</label>
                        <input
                            style={styles.input}
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Canvas URL</label>
                        <input
                            style={styles.input}
                            type="text"
                            placeholder="school.instructure.com"
                            value={canvasBaseUrl}
                            onChange={(e) => setCanvasBaseUrl(e.target.value)}
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Canvas API Token</label>
                        <input
                            style={styles.input}
                            type="password"
                            placeholder="Enter your Canvas API token"
                            value={canvasToken}
                            onChange={(e) => setCanvasToken(e.target.value)}
                            required
                        />

                        <p style={styles.helpText}>
                            Generate a token in your{' '}
                            <a
                            href={`${(canvasBaseUrl.startsWith('http') ? canvasBaseUrl : `https://${canvasBaseUrl}`).replace(/\/+$/, '')}/profile/settings`}                                target="_blank"
                                rel="noopener noreferrer"
                                style={styles.helpLink}
                            >
                                Canvas Profile Settings
                            </a>
                            {' '}under Approved Integrations. You can also
                            update your token later in Settings.
                        </p>
                    </div>

                    {error && <p style={styles.error}>{error}</p>}
                    {success && <p style={styles.success}>{success}</p>}

                    <button
                        style={{
                            ...styles.button,
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p style={styles.loginText}>
                    Already have an account?{' '}
                    <Link to="/login" style={styles.link}>
                        Sign in
                    </Link>
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

// Right panel
rightPanel: {
    flex: '0 0 480px',
    boxSizing: 'border-box',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 48px',
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
label: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#444',
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
link: {
    color: '#4361ee',
    textDecoration: 'none',
    fontWeight: '500',
},

// Canvas token instructions
helpText: {
    fontSize: '11px',
    color: '#888',
    margin: '4px 0 0 0',
    lineHeight: '1.5',
},
helpLink: {
    color: '#4361ee',
    textDecoration: 'none',
},

// Messages
error: {
    color: '#e63946',
    fontSize: '13px',
    margin: 0,
    padding: '10px 14px',
    backgroundColor: '#fff0f0',
    borderRadius: '8px',
    border: '1px solid #ffd0d0',
},
success: {
    color: '#16803c',
    fontSize: '13px',
    margin: 0,
},

// Login link
loginText: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#666',
    margin: '0 0 16px 0',
},
    
};

export default Register;