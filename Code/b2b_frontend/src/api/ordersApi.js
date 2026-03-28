import axiosInstance from './axiosInstance';

export const ordersApi = {
    createOrder: async (orderData) => {
        const response = await axiosInstance.post('/orders/', orderData);
        return response.data;
    },
    
    getOrderHistory: async () => {
        const response = await axiosInstance.get('/orders/history/');
        return response.data;
    },
    
    getOrder: async (id) => {
        const response = await axiosInstance.get(`/orders/${id}/`);
        return response.data;
    }
};
