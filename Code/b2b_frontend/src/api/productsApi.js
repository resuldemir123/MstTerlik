import axiosInstance from './axiosInstance';

export const productsApi = {
    getProducts: async (gender) => {
        const params = {};
        if (gender) params.gender = gender;
        const response = await axiosInstance.get('/products/', { params });
        return response.data;
    },
    
    getProduct: async (id) => {
        const response = await axiosInstance.get(`/products/${id}/`);
        return response.data;
    },
    
    getProductVariants: async (id) => {
        const response = await axiosInstance.get(`/products/${id}/variants/`);
        return response.data;
    }
};
