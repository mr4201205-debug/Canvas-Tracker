import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../Services/api';

function ResetPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleReset = async () => {
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        const token = new URLSearchParams(window.location.search).get('token');

        try {
            await authService.resetPassword(token, newPassword);
    
            setSuccess(true);
            setMessage('Password reset successfully. Redirecting to login...');
            setTimeout(() => navigate('/login'), 3000);
        }  catch (err) {
    const errorMsg = err.response?.data || 'Invalid or expired reset link. Please request a new one.';
    setMessage(errorMsg);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>ClassSync</h1>
                <p style={{ margin: '0 0 16px 0', color: '#666', fontSize: '14px' }}>Reset your password</p>
                
                <input
                    style={styles.input}
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                    style={styles.input}
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                
                {message && (
                    <p style={{ color: success ? 'green' : 'red', fontSize: '13px', margin: '0 0 10px 0' }}>{message}</p>
                )}
                
                <button style={styles.button} onClick={handleReset}>
                    Reset Password
                </button>
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
    input: {
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '14px',
        width: '100%',
        boxSizing: 'border-box',
    },
    button: {
        padding: '12px',
        backgroundColor: '#4361ee',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        cursor: 'pointer',
        width: '100%',
    },
};

export default ResetPassword;
