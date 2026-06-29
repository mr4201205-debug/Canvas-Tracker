import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userService } from '../Services/api';

function Settings() {
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [canvasBaseUrl, setCanvasBaseUrl] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profileMessage, setProfileMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [notify72, setNotify72] = useState(true);
    const [notify24, setNotify24] = useState(true);
    const [notify4, setNotify4] = useState(true);
    const [prefMessage, setPrefMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        userService.getPreferences()
            .then(response => {
                setNotify72(response.data.notify72Hours);
                setNotify24(response.data.notify24Hours);
                setNotify4(response.data.notify4Hours);
            })
            .catch(err => console.log('Error fetching preferences:', err));
        userService.getMe()
            .then(response => {
                setUser(response.data);
                setName(response.data.name);
                setEmail(response.data.email || ''); 
                setCanvasBaseUrl(response.data.canvasBaseUrl || '');
            })
            .catch(() => navigate('/login'));
    }, [navigate]);

    const handleUpdatePreferences = async () => {
        try {
            await userService.updatePreferences(notify72, notify24, notify4);
            setPrefMessage('Preferences saved successfully');
            } catch (err) {
        setPrefMessage('Failed to save preferences');
        }
    };

    const handleUpdateProfile = async () => {
        
        try {
            const emailChanged = email !== user.email;
            await userService.updateProfile(name, email, canvasBaseUrl);
            setProfileMessage('Profile updated successfully');
             if (emailChanged) {
                alert('Email updated successfully! Please log in again with your new email.');
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                // If email didn't change, just refresh the local user object with the new name/URL
                setUser({ ...user, name, canvasBaseUrl });
            }
        } catch (err) {
            setProfileMessage('Failed to update profile');
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setPasswordMessage('New passwords do not match');
            return;
        }
        try {
            await userService.changePassword(currentPassword, newPassword);
            setPasswordMessage('Password changed successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setPasswordMessage('Current password is incorrect');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div style={styles.layout}>
            <div style={styles.sidebar}>
                <Link to="/dashboard" style={{ ...styles.sidebarItem, textDecoration: 'none', color: '#333' }}>
                    Dashboard
                </Link>
                
                <Link to="/courses" style={{ ...styles.sidebarItem, textDecoration: 'none', color: '#333' }}>
                    Courses
                </Link>
                
                
                <div style={{ ...styles.sidebarItem, backgroundColor: '#4361ee', color: 'white' }}>
                    Settings
            </div>
            </div>


            <div style={styles.mainContent}>
                <nav style={styles.navbar}>
                    <h2 style={styles.logo}>ClassSync</h2>
                    <div style={styles.navRight}>
                        {user && <span style={styles.userName}>Hello, {user.name}</span>}
                        <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
                    </div>
                </nav>

                <div style={styles.content}>
                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}>Account Settings</h2>
                        <div style={styles.field}>
                            <label style={styles.label}>Name</label>
                            <input
                                style={styles.input}
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Email</label>
                            <input
                                style={{ ...styles.input}}
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Canvas URL</label>
                            <input
                                style={styles.input}
                                type="text"
                                value={canvasBaseUrl}
                                onChange={(e) => setCanvasBaseUrl(e.target.value)}
                            />
                        </div>
                        {profileMessage && (
                            <p style={{ color: profileMessage.includes('success') ? 'green' : 'red', fontSize: '13px' }}>
                                {profileMessage}
                            </p>
                        )}
                        <button style={styles.button} onClick={handleUpdateProfile}>
                            Save Changes
                        </button>
                    </div>

                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}>Notification Preferences</h2>
                        <p style={{ color: '#666', fontSize: '13px', marginBottom: '16px' }}>
                            Choose when you want to receive email reminders for upcoming assignments.
                        </p>
                        
                        {/* 72 hour reminder toggle */}  
                    <div style={styles.toggleRow}> 
                    <div> 
                        <p style={styles.toggleLabel}>72 hour reminder</p> 
                        <p style={styles.toggleDesc}>Get an email 3 days before an assignment is due</p> 
                    </div> 
                    <label style={styles.switch}> 
                        <input 
                        type="checkbox" 
                        checked={notify72} 
                        onChange={(e) => setNotify72(e.target.checked)} 
                        style={{ display: 'none' }} 
                        /> 
                        {/* Slider Background */}
                        <span style={{ ...styles.slider, backgroundColor: notify72 ? '#4361ee' : '#ccc', position: 'relative', display: 'inline-block', width: '40px', height: '20px', borderRadius: '10px' }}> 
                        {/* Moving White Knob */}
                        <span style={{ 
                            position: 'absolute', 
                            top: 2, 
                            left: notify72 ? 22 : 2, 
                            width: '16px', 
                            height: '16px', 
                            backgroundColor: 'white', 
                            borderRadius: '50%', 
                            transition: 'left 0.2s ease' 
                        }} /> 
                        </span> 
                    </label> 
                    </div>



                        {/* 24 hour reminder toggle */}
                    <div style={styles.toggleRow}>
                    <div>
                        <p style={styles.toggleLabel}>24 hour reminder</p>
                        <p style={styles.toggleDesc}>Get an email 1 day before an assignment is due</p>
                    </div>
                    <label style={styles.switch}>
                        <input 
                        type="checkbox" 
                        checked={notify24} 
                        onChange={(e) => setNotify24(e.target.checked)} 
                        style={{ display: 'none' }} 
                        />
                        <span style={{ ...styles.slider, backgroundColor: notify24 ? '#4361ee' : '#ccc', position: 'relative', display: 'inline-block', width: '40px', height: '20px', borderRadius: '10px' }}>
                        <span style={{ 
                            position: 'absolute', 
                            top: 2, 
                            left: notify24 ? 22 : 2, 
                            width: '16px', 
                            height: '16px', 
                            backgroundColor: 'white', 
                            borderRadius: '50%', 
                            transition: 'left 0.2s ease' 
                        }} />
                        </span>
                    </label>
                    
                    </div>
                        <div style={styles.toggleRow}>
                            <div>
                                <p style={styles.toggleLabel}>4 hour reminder</p>
                                <p style={styles.toggleDesc}>Get an urgent email 4 hours before an assignment is due</p>
                            </div>
                            <label style={styles.switch}>
                                <input
                                    type="checkbox"
                                    checked={notify4}
                                    onChange={(e) => setNotify4(e.target.checked)}
                                    style={{ display: 'none' }}
                                />
                                <span style={{
                                    ...styles.slider,
                                    backgroundColor: notify4 ? '#4361ee' : '#ccc', 
                                    position: 'relative', 
                                    display: 'inline-block', 
                                    width: '40px', height: '20px', 
                                    borderRadius: '10px'
                                }} >
                                <span style={{ position: 'absolute', 
                                        top: 2, left: notify4 ? 22 : 2, 
                                        width: '16px', height: '16px', 
                                        backgroundColor: 'white', 
                                        borderRadius: '50%', 
                                        transition: 'left 0.2s ease' 
                                }} />
                            </span>
                            </label>
                        </div>

                        {prefMessage && (
                            <p style={{ color: prefMessage.includes('success') ? 'green' : 'red', fontSize: '13px' }}>
                                {prefMessage}
                            </p>
                        )}

                        <button style={styles.button} onClick={handleUpdatePreferences}>
                            Save Preferences
                        </button>
                    </div>

                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}>Change Password</h2>
                        <div style={styles.field}>
                            <label style={styles.label}>Current Password</label>
                            <input
                                style={styles.input}
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>New Password</label>
                            <input
                                style={styles.input}
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Confirm New Password</label>
                            <input
                                style={styles.input}
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        {passwordMessage && (
                            <p style={{ color: passwordMessage.includes('success') ? 'green' : 'red', fontSize: '13px' }}>
                                {passwordMessage}
                            </p>
                        )}
                        <button style={styles.button} onClick={handleChangePassword}>
                            Change Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    layout: { display: 'flex', minHeight: '100vh', width: '100%' },
    sidebar: {
        width: '200px',
        flexShrink: 0,
        backgroundColor: 'white',
        padding: '20px',
        boxShadow: '2px 0 8px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    sidebarItem: {
        padding: '12px',
        borderRadius: '8px',
        fontSize: '14px',
        cursor: 'pointer',
        display: 'block',
    },
    mainContent: { flex: 1, backgroundColor: '#f0f2f5', display: 'flex', flexDirection: 'column' },
    navbar: {
        backgroundColor: 'white',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    },
    logo: { margin: 0, color: '#1a1a2e', fontSize: '22px' },
    navRight: { display: 'flex', alignItems: 'center', gap: '16px' },
    userName: { color: '#666', fontSize: '14px' },
    logoutButton: {
        padding: '8px 16px',
        backgroundColor: 'transparent',
        border: '1px solid #ddd',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        color: '#666',
    },
    content: { padding: '32px', maxWidth: '600px' },
    section: {
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        marginBottom: '24px',
    },
    sectionTitle: { margin: '0 0 20px 0', color: '#1a1a2e' },
    field: { marginBottom: '16px' },
    label: { display: 'block', fontSize: '13px', color: '#666', marginBottom: '6px' },
    input: {
        width: '100%',
        padding: '10px 12px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box',
    },
    button: {
        padding: '10px 24px',
        backgroundColor: '#4361ee',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        marginTop: '8px',
    },

    toggleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: '1px solid #f0f0f0',
    },
    toggleLabel: {
        margin: '0 0 4px 0',
        fontSize: '14px',
        color: '#1a1a2e',
        fontWeight: 'bold',
    },
    toggleDesc: {
        margin: 0,
        fontSize: '12px',
        color: '#888',
    },
    switch: {
    position: 'relative',
    display: 'inline-block',
    width: '44px',
    height: '24px',
    cursor: 'pointer',
    },
    slider: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: '12px',
        transition: 'background-color 0.2s',
        display: 'flex',
        alignItems: 'center',
        padding: '2px', // Gives padding around the white knob
        boxSizing: 'border-box',
    },
    knob: {
        width: '20px',
        height: '20px',
        backgroundColor: 'white',
        borderRadius: '50%',
        transition: 'transform 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
    },
        
};

export default Settings;

