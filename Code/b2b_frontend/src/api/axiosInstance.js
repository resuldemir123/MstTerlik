import axios from 'axios';
import { auth } from '../firebase/firebase';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api/',
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const user = auth.currentUser;
        if (user) {
            try {
                // Firebase SDK automatically refreshes the token if it's expired
                const token = await user.getIdToken(false);
                config.headers.Authorization = `Bearer ${token}`;
            } catch (err) {
                console.error("Token alınamadı:", err);
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
