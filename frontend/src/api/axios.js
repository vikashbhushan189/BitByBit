import axios from 'axios';

// UPDATE THIS URL
const api = axios.create({
    baseURL: 'https://bitbybit-394322708404.us-central1.run.app/api/', 
    headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
    }
});

// Add the token to every request if we have one
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    
    // FIX: Only attach token from storage if the request 
    // doesn't already have an Authorization header.
    // This prevents overwriting the fresh token during login.
    if (token && !config.headers.Authorization) {
        config.headers.Authorization = `JWT ${token}`;
    }
    
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;