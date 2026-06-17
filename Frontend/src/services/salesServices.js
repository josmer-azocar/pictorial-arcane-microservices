import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getSoldArtworks = async (startDate, endDate) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/core/admin/billingSummary`, {
            params: {
                start: startDate,
                end: endDate
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error buscando los datos de compra:", error);
        throw error;
    }
};