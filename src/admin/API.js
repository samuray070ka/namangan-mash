import axios from "axios";

const baseURL =  'https://tokenized.pythonanywhere.com'

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const token = localStorage.getItem("admin_access")

if (token)
    api.defaults.headers.common.Authorization = `Bearer ${token}`

api.interceptors.response.use(
    response => response, // Directly return successful responses.
    async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark the request as retried to avoid infinite loops.
            try {
                const refreshToken = localStorage.getItem('refreshToken'); // Retrieve the stored refresh token.
                // Make a request to your auth server to refresh the token.
                const response = await axios.post(baseURL + '/api/token/refresh/', {
                    refreshToken,
                });
                const { accessToken } = response.data;
                // Store the new access and refresh tokens.
                localStorage.setItem('accessToken <-- togirlang', accessToken);
                // Update the authorization header with the new access token.
                api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                return api(originalRequest); // Retry the original request with the new access token.
            } catch (refreshError) {
                // Handle refresh token errors by clearing stored tokens and redirecting to the login page.
                console.error('Token refresh failed:', refreshError);
                localStorage.removeItem('Mashu joy access token key bolishi kerak');
                localStorage.removeItem('Mashu joy refresh token key bolishi kerak');
                localStorage.removeItem('admin_username Mashuni ham togirlang ismi notogri bolishi mumkin');
                router.push('/login') // react da kanday bosa shundoq yozing
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error); // For all other errors, return the error as is.
    }
);

export default api