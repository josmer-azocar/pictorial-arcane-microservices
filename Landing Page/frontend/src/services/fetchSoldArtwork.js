import axios from "axios";
const url = "https://pictorialarcane-h5g8cdgug9d5awd3.canadacentral-01.azurewebsites.net";

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function fetchSoldArtwork(startDate, endDate) { //billing
    try {
        const billing = await axios.get(`${url}/admin/billingSummary`, {
        params: {
            startDate,
            endDate
        },
        headers: getAuthHeaders()
    });
    console.log("Datos de ventas:", billing.data);
    return billing.data;
    } catch (error) {
        console.error("Error fetching sold artwork:", error);
        throw error;
    }
    
};

export async function fetchPaidArtwork(startDate, endDate, page = 0, size = 10) { 
    try {
        const paidArtwork = await axios.get(`${url}/admin/getSoldArtworksByDate`, {
        params: {
            startDate,
            endDate,
            page,
            size // Parámetros para paginación
        }, 
        headers: getAuthHeaders()
    });
    console.log("Datos de obras pagadas:", paidArtwork.data);
    return paidArtwork.data;
    } catch (error) {
        console.error("Error fetching paid artwork:", error);
        throw error;
    }
}
