import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    login: (email, password) =>
        api.post('/auth/login', { email, password }),

    register: (name, email, password, canvasBaseUrl) =>
        api.post('/auth/register', { name, email, password, canvasBaseUrl }),
};

export const assignmentService = {
    getMyAssignments: () => api.get('/users/me/assignments'),
    markAsSubmitted: (assignmentId) => api.put(`/users/me/assignments/${assignmentId}/submit`),
};

export const userService = {
    getMe: () => api.get('/users/me'),
    updateProfile: (name, email, canvasBaseUrl) =>
        api.put('/users/me', { name, email, canvasBaseUrl }),
    changePassword: (currentPassword, newPassword) =>
        api.put('/users/me/password', { currentPassword, newPassword }),
};



export const canvasService = {
    syncAssignments: () => api.get('/canvas/sync'),
    getCourses: () => api.get('/canvas/courses'),
};



export default api;