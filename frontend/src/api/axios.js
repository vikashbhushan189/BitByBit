import axios from 'axios';

const api = axios.create({
    baseURL: 'https://bitbybit-p3ym.onrender.com/api/',
    headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
    }
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