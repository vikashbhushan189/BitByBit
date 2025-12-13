import axios from 'axios';

// Base URL (Cloud Run or Local)
const baseURL = 'https://bitbybit-p3ym.onrender.com/api/';

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Access Token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `JWT ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Response Interceptor: Handle Token Refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 (Unauthorized) and we haven't tried refreshing yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');

            if (refreshToken) {
                try {
                    // Call backend to get new access token
                    const response = await axios.post(`${baseURL}auth/jwt/refresh/`, {
                        refresh: refreshToken
                    });

                    // Save new tokens
                    localStorage.setItem('access_token', response.data.access);
                    // Djoser might rotate refresh token, so save it if returned
                    if (response.data.refresh) {
                        localStorage.setItem('refresh_token', response.data.refresh);
                    }

                    // Retry original request with new token
                    api.defaults.headers.common['Authorization'] = `JWT ${response.data.access}`;
                    originalRequest.headers['Authorization'] = `JWT ${response.data.access}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    console.error("Session expired. Please login again.");
                    // Clear storage and redirect to login if refresh fails
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('user_role');
                    window.location.href = '/login';
                }
            } else {
                // No refresh token, force logout
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;