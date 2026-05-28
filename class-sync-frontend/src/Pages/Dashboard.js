import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../Services/api';

function Dashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        userService.getMe()
            .then(response => setUser(response.data))
            .catch(() => navigate('/login'));
    }, [navigate]);

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Welcome to ClassSync</h1>
            {user && <p style={styles.subtitle}>Hello, {user.name}</p>}
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5',
    },
    title: {
        color: '#1a1a2e',
    },
    subtitle: {
        color: '#666',
        fontSize: '18px',
    },
};

export default Dashboard;