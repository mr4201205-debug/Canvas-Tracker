import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userService, canvasService } from '../Services/api';

function Courses() {
    const [user, setUser] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user data
        userService.getMe()
            .then(response => setUser(response.data))
            .catch(() => navigate('/login'));

        // Fetch courses data
        canvasService.getCourses()
            .then(response => {
                setCourses(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching courses:', err);
                setLoading(false);
            });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleSync = async () => {
        try {
            setSyncing(true);
            await canvasService.syncAssignments();
            alert('Assignments synced successfully!');
        } catch (err) {
            console.error('Error syncing assignments:', err);
            alert('Failed to sync assignments.');
        } finally {
            setSyncing(false);
        }
    };

    return (
        <div style={styles.layout}>

            {/* SIDEBAR */}
            <div style={styles.sidebar}>
                {/* Dashboard Link */}
                <Link to="/dashboard" style={{ ...styles.sidebarItem, textDecoration: 'none', color: '#333' }}>
                    Dashboard
                </Link>

                {/* Active Courses Link */}
                <div
                    style={{
                        ...styles.sidebarItem,
                        backgroundColor: "#4361ee",
                        color: "white",
                    }}
                >
                    Courses
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div style={styles.mainContent}>

                {/* NAVBAR */}
                <nav style={styles.navbar}>
                    <h2 style={styles.logo}>ClassSync</h2>

                    <div style={styles.navRight}>
                        {user && <span style={styles.userName}>Hello, {user.name}</span>}
                        <button style={styles.logoutButton} onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </nav>

                {/* CONTENT AREA */}
                <div style={styles.content}>
                    
                    <div style={styles.headerRow}>
                        <h2 style={styles.sectionTitle}>My Courses</h2>
                        <button 
                            style={{ ...styles.syncButton, opacity: syncing ? 0.7 : 1 }} 
                            onClick={handleSync}
                            disabled={syncing}
                        >
                            {syncing ? 'Syncing...' : 'Sync Canvas Assignments'}
                        </button>
                    </div>

                    {loading ? (
                        <p style={styles.emptyMessage}>Loading your courses...</p>
                    ) : courses.length === 0 ? (
                        <p style={styles.emptyMessage}>No courses found. Try syncing with Canvas.</p>
                    ) : (
                        <div style={styles.courseGrid}>
                            {courses.map(course => (
                                <div key={course.id} style={styles.courseCard}>
                                    <h3 style={styles.courseTitle}>{course.name}</h3>
                                    <p style={styles.courseId}>ID: {course.id}</p>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

const styles = {
    layout: {
        display: "flex",
        minHeight: "100vh",
        width: "100%",
    },

    sidebar: {
        width: "200px",
        flexShrink: 0,
        backgroundColor: "white",
        padding: "20px",
        boxShadow: "2px 0 8px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        zIndex: 10,
    },

    sidebarItem: {
        padding: "12px",
        borderRadius: "8px",
        fontSize: "14px",
        cursor: "pointer",
    },

    mainContent: {
        flex: 1,
        backgroundColor: "#f0f2f5",
        display: "flex",
        flexDirection: "column",
    },

    navbar: {
        backgroundColor: 'white',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    },

    logo: {
        margin: 0,
        color: '#1a1a2e',
        fontSize: '22px',
    },

    navRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },

    userName: {
        color: '#666',
        fontSize: '14px',
    },

    logoutButton: {
        padding: '8px 16px',
        backgroundColor: 'transparent',
        border: '1px solid #ddd',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        color: '#666',
    },

    content: {
        padding: '32px',
    },

    headerRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
    },

    sectionTitle: {
        margin: 0,
    },

    syncButton: {
        padding: '10px 20px',
        backgroundColor: '#4cc9f0',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
    },

    emptyMessage: {
        color: '#666',
        fontStyle: 'italic',
    },

    courseGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px',
    },

    courseCard: {
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        borderTop: '4px solid #4361ee',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '100px',
    },

    courseTitle: {
        margin: '0 0 8px 0',
        fontSize: '18px',
        color: '#1a1a2e',
    },

    courseId: {
        margin: 0,
        fontSize: '12px',
        color: '#888',
    },
};

export default Courses;