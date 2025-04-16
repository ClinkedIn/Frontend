import axios from 'axios';
import { BASE_URL } from '../constants';
import { getRequest } from '../services/axios';

const axiosInterceptor = axios.interceptors.response.use(async (response) => {
    return response;
}, async (error) => {
    if (error.response) {

        const originalRequest = error.config;
        if (error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshTokenResponse = await getRequest(`${BASE_URL}/user/refresh-token`);
            if (refreshTokenResponse && refreshTokenResponse.status === 200) {
                const res = await axios(originalRequest);
                return res;
            } else {
                return Promise.reject(refreshTokenResponse ? refreshTokenResponse.data : 'Unknown error')
            }
        }
    } else {
        console.log('Error', error.message);
    }

    return Promise.reject(error);
});

export default axiosInterceptor;