import axios from 'axios';

const baseURL = 'http://127.0.0.1:8000/api/';
const axiosInstance = axios.create({
    baseURL: baseURL,
    timout: 5000,
    headers: {
        'Authorization': 
            localStorage.getItem('access_token') 
                ? "JWT " + localStorage.getItem('access_token') 
                : null,
        'Content-Type': 'application/json',
        'accept': 'application/json'
    }
});

axiosInstance.interceptors.response.use(
    response => response,
        error => {
            const originalRequest = error.config;
            
            if (error.response.status 
                === 401 && error.response.statusText 
                === "Unauthorized" && error.response.data.code 
                === "token_not_valid") {
                    const refreshToken = localStorage.getItem('refresh_token');
                    if (refreshToken) {
                        const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));
                        const now = Math.ceil(Date.now() / 1000);
                        if (tokenParts.exp > now) {
                            return axiosInstance
                                .post('/token/refresh/', {refresh: refreshToken})
                                .then((response) => {

                                    localStorage.setItem('access_token', response.data.access);
                                    localStorage.setItem('refresh_token', response.data.refresh);

                                    axiosInstance.defaults.headers['Authorization'] = 'JWT ' + response.data.access;
                                    originalRequest.headers['Authorization'] = 'JWT ' + response.data.access;

                                    return axiosInstance(originalRequest);
                                })
                                    .catch(err => {
                                        console.log(err)
                                    });
                        }
                            else {
                                console.log("Refresh token is expired", tokenParts.exp, now);
                            }
                    }
                        else {
                            console.log("no refresh token");
                        }
                } 
                    return Promise.reject(error);
        }
);

export default axiosInstance;