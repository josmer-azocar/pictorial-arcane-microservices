import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function fetchPurchases(page = 0, size = 10) {
    try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
        const params = {
            page,
            size
        };

        const response = await axios.get(`${API_BASE_URL}/core/sale/MyPurchases`, { params, headers });
        return response.data;
    } catch (error) {
        console.error("Error fetching purchases:", error);
        throw error;
    }
}