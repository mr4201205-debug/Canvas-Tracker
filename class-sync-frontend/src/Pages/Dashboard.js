import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userService, assignmentService } from '../Services/api';

function Dashboard() {
    const [user, setUser] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        userService.getMe()
            .then(response => setUser(response.data))
            .catch(() => navigate('/login'));

        assignmentService.getMyAssignments()
            .then(response => setAssignments(response.data))
            .catch(err => console.log('Error fetching assignments', err));
    }, [navigate]);

    const getHoursUntilDue = (dueDate) => {
        const now = new Date();
        const due = new Date(dueDate);
        const diffMs = due - now;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffMs < 0) return 'Overdue';
        if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} left`;
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} left`;
    };

    const upcomingAssignments = assignments.filter(
        a => new Date(a.dueDate) > new Date() && !a.submitted
    );

    const overdueAssignments = assignments.filter(
        a => new Date(a.dueDate) < new Date() && !a.submitted
    );

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleMarkSubmitted = async (assignmentId) => {
        try {
            await assignmentService.markAsSubmitted(assignmentId);
            setAssignments(assignments.map(a =>
                a.id === assignmentId ? { ...a, submitted: true } : a
            ));
        } catch (err) {
            console.log('Error marking assignment as submitted', err);
        }
    };

    return (
        <div style={styles.layout}>

            {/* SIDEBAR */}
            <div style={styles.sidebar}>
                {/* Active Dashboard Button */}
                <div
                    style={{
                        ...styles.sidebarItem,
                        backgroundColor: "#4361ee",
                        color: "white",
                    }}
                >
                    Dashboard
                </div>

                {/* Navigation link to your new Courses file */}
                <Link 
                    to="/courses" 
                    style={{ 
                        ...styles.sidebarItem, 
                        textDecoration: 'none', 
                        color: '#333' 
                    }}
                >
                    Courses
                </Link>

                <Link to="/settings" 
                      style={{ 
                        ...styles.sidebarItem, 
                        textDecoration: 'none', 
                        color: '#333' }}
                        >
                    Settings
                </Link>
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

                    <div style={styles.summaryCards}>
                        <div style={styles.card}>
                            <h3 style={styles.cardNumber}>{assignments.length}</h3>
                            <p style={styles.cardLabel}>Total Assignments</p>
                        </div>

                        <div style={{ ...styles.card, borderTop: '4px solid #4361ee' }}>
                            <h3 style={styles.cardNumber}>{upcomingAssignments.length}</h3>
                            <p style={styles.cardLabel}>Upcoming</p>
                        </div>

                        <div style={{ ...styles.card, borderTop: '4px solid #e63946' }}>
                            <h3 style={styles.cardNumber}>{overdueAssignments.length}</h3>
                            <p style={styles.cardLabel}>Overdue</p>
                        </div>
                    </div>

                    <h2 style={styles.sectionTitle}>Upcoming Assignments</h2>

                    {upcomingAssignments.length === 0 && (
                        <p style={styles.emptyMessage}>
                            No upcoming assignments. You are all caught up!
                        </p>
                    )}

                    {upcomingAssignments.map(assignment => (
                        <div key={assignment.id} style={styles.assignmentCard}>
                            <div style={styles.assignmentLeft}>
                                <h3 style={styles.assignmentTitle}>{assignment.title}</h3>
                                <p style={styles.assignmentCourse}>{assignment.courseName}</p>
                            </div>

                            <div style={styles.assignmentRight}>
                                <p style={styles.dueDate}>
                                    {new Date(assignment.dueDate).toLocaleDateString()}
                                </p>
                                <p style={styles.timeLeft}>
                                    {getHoursUntilDue(assignment.dueDate)}
                                </p>
                            </div>

                            <button
                                style={styles.submitButton}
                                onClick={() => handleMarkSubmitted(assignment.id)}
                            >
                                Mark as Submitted
                            </button>
                        </div>
                    ))}

                    {overdueAssignments.length > 0 && (
                        <>
                            <h2 style={{ ...styles.sectionTitle, color: '#e63946' }}>
                                Overdue
                            </h2>

                            {overdueAssignments.map(assignment => (
                                <div
                                    key={assignment.id}
                                    style={{
                                        ...styles.assignmentCard,
                                        borderLeft: '4px solid #e63946'
                                    }}
                                >
                                    <div style={styles.assignmentLeft}>
                                        <h3 style={styles.assignmentTitle}>{assignment.title}</h3>
                                        <p style={styles.assignmentCourse}>{assignment.courseName}</p>
                                    </div>

                                    <div style={styles.assignmentRight}>
                                        <p style={{ ...styles.timeLeft, color: '#e63946' }}>
                                            Overdue
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </>
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
        cursor: "pointer",
        fontSize: "14px",
        transition: "all 0.2s ease",
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

    summaryCards: {
        display: 'flex',
        gap: '20px',
        marginBottom: '32px',
    },

    card: {
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        flex: 1,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        borderTop: '4px solid #4cc9f0',
    },

    cardNumber: {
        margin: 0,
        fontSize: '36px',
    },

    cardLabel: {
        margin: '8px 0 0 0',
        color: '#666',
        fontSize: '14px',
    },

    sectionTitle: {
        marginBottom: '16px',
    },

    emptyMessage: {
        color: '#666',
        fontStyle: 'italic',
    },

    assignmentCard: {
        backgroundColor: 'white',
        padding: '20px 24px',
        borderRadius: '12px',
        marginBottom: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        borderLeft: '4px solid #4361ee',
    },

    assignmentLeft: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },

    assignmentTitle: {
        margin: 0,
        fontSize: '16px',
    },

    assignmentCourse: {
        margin: 0,
        fontSize: '13px',
        color: '#666',
    },

    assignmentRight: {
        textAlign: 'right',
    },

    dueDate: {
        margin: 0,
        fontSize: '13px',
        color: '#666',
    },

    timeLeft: {
        margin: '4px 0 0 0',
        fontSize: '13px',
        fontWeight: 'bold',
        color: '#4361ee',
    },

    submitButton: {
        padding: '8px 16px',
        backgroundColor: '#4cc9f0',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '13px',
    },
};

export default Dashboard;