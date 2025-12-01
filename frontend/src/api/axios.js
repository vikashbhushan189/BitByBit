import axios from 'axios';

// NUCLEAR FIX: We are hardcoding the Render URL to force it to work.
// This bypasses the environment variable issue completely.
const api = axios.create({
    baseURL: 'https://bitbybit-p3ym.onrender.com/api/',
});

// Add the token to every request if we have one
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `JWT ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;