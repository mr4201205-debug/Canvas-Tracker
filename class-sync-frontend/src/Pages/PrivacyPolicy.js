import React from 'react';
import { Link } from 'react-router-dom';

function PrivacyPolicy() {
    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <h1 style={styles.title}>Privacy Policy</h1>
                <p style={styles.updated}>Last updated: November 2026</p>

                <h2 style={styles.heading}>What ClassSync is</h2>
                <p style={styles.text}>
                    ClassSync is a free tool that connects to your Canvas account and
                    emails you reminders before your assignments are due. It was built
                    and is maintained by a student developer. ClassSync is an independent
                    project and is not affiliated with or endorsed by Instructure or any
                    university.
                </p>

                <h2 style={styles.heading}>What we collect</h2>
                <ul style={styles.list}>
                    <li>Your name and email address.</li>
                    <li>Your password, stored only as a one way BCrypt hash.</li>
                    <li>Your Canvas URL, for example yourschool.instructure.com.</li>
                    <li>Your Canvas API token, stored encrypted with AES encryption</li>
                    <li>
                        Assignment details pulled from Canvas: title, course name, due date,
                        points, and whether you have submitted it.
                    </li>
                    <li>Your reminder preferences (72 hour, 24 hour, and 4 hour).</li>
                    <li>A record of when we last emailed you about each assignment.</li>
                </ul>

                <h2 style={styles.heading}>What we do not collect</h2>
                <ul style={styles.list}>
                    <li>Your Canvas or university password. We never see it.</li>
                    <li>Your grades, GPA, or the content of your submissions</li>
                    <li>Payment information. ClassSync is free.</li>
                </ul>

                <h2 style={styles.heading}>How we use your data</h2>
                <p style={styles.text}>
                    We use your data only to run ClassSync: to log you in, to read your
                    upcoming assignments from Canvas, and to send you reminder and
                    account emails such as email verification, password reset, and
                    notices that your Canvas token has expired. We do not sell your data,
                    share it for advertising, or use it for any other purpose.
                </p>

                <h2 style={styles.heading}>Canvas access</h2>
                <p style={styles.text}>
                    ClassSync only reads your courses and assignments from Canvas. It
                    never submits work, edits content, or changes anything in your Canvas
                    account. You can revoke the token at any time from your Canvas profile
                    settings under Approved Integrations, and ClassSync will stop syncing
                    immediately.
                </p>

                <h2 style={styles.heading}>Services we use</h2>
                <p style={styles.text}>
                    To operate ClassSync we rely on trusted providers. Resend delivers
                    our emails and receives your email address and the message text.
                    Supabase hosts our database. Render hosts our server. Netlify hosts
                    this website. These providers process data only to provide their
                    service to us.
                </p>

                <h2 style={styles.heading}>How we protect your data</h2>
                <p style={styles.text}>
                    All connections use HTTPS. Passwords are hashed with BCrypt and
                    cannot be read by anyone, including us. Canvas tokens are encrypted
                    before they are stored and are only decrypted in memory when we call
                    Canvas on your behalf. No system is perfectly secure, but we take
                    reasonable steps to protect your information.
                </p>

                <h2 style={styles.heading}>Data retention and deletion</h2>
                <p style={styles.text}>
                    We keep your data for as long as your account exists. You can delete
                    your account at any time from Settings under Danger Zone. Deleting
                    your account permanently removes your profile, your encrypted Canvas
                    token, your assignments, and your preferences from our database. Our
                    hosting providers may keep short lived operational logs and email
                    delivery records for a limited time.
                </p>

                <h2 style={styles.heading}>Children</h2>
                <p style={styles.text}>
                    ClassSync is intended for university students and is not directed at
                    children under 13.
                </p>

                <h2 style={styles.heading}>Changes to this policy</h2>
                <p style={styles.text}>
                    If we make meaningful changes we will update the date at the top of
                    this page.
                </p>

                <h2 style={styles.heading}>Contact</h2>
                <p style={styles.text}>
                    Questions or data requests? Email mr578862@gmail.com.
                    
                </p>
                <p style={styles.text}>
                    <Link to="/login" style={styles.back}>Back to Login</Link>
                </p>
            </div>
        </div>
    );
}

const styles = {
    page: {
        backgroundColor: '#f0f2f5',
        minHeight: '100vh',
        padding: '40px 20px',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
    },
    container: {
        maxWidth: '720px',
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    },
    back: {
        color: '#4361ee',
        textDecoration: 'none',
        fontSize: '14px',
    },
    title: {
        fontSize: '32px',
        color: '#1a1a2e',
        margin: '24px 0 4px 0',
    },
    updated: {
        color: '#888',
        fontSize: '13px',
        margin: '0 0 24px 0',
    },
    heading: {
        fontSize: '18px',
        color: '#1a1a2e',
        margin: '28px 0 8px 0',
    },
    text: {
        fontSize: '14px',
        color: '#444',
        lineHeight: '1.7',
        margin: 0,
    },
    list: {
        fontSize: '14px',
        color: '#444',
        lineHeight: '1.8',
        margin: 0,
        paddingLeft: '20px',
    },
};

export default PrivacyPolicy;